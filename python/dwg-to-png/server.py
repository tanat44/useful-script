import http.server
import socketserver
import uuid
import cgi
import os
import json
import shutil


from DwgConverter import clearFolder, convertDwg

PORT = 4444
TEMP_DIR = "./temp"
IN_DIR = "in"
OUT_DIR = "out"

def preparePath(jobId, dir):
    return os.path.join(TEMP_DIR, jobId, dir)

def generateId():
    return str(uuid.uuid4().hex)

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):

    def do_POST(self):      
        jobId = generateId()
        jobDir = os.path.join(TEMP_DIR, jobId)
        os.mkdir(jobDir)
        os.mkdir(preparePath(jobId, IN_DIR))
        os.mkdir(preparePath(jobId, OUT_DIR))

        # save data 
        success, filename = self.deal_post_data(jobId)
        if not success:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin','*')
            self.end_headers()
            self.wfile.write(json.dumps({"msg": "file to save the upload file"}).encode('utf-8'))
            shutil.rmtree(jobDir)
            return

        # convert files
        pngFile = convertDwg(preparePath(jobId, IN_DIR), preparePath(jobId, OUT_DIR))
        if not pngFile:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin','*')
            self.end_headers()
            self.wfile.write(json.dumps({"msg": "conversion fails"}).encode('utf-8'))
            shutil.rmtree(jobDir)
            return

        # prepare response
        f = open(pngFile, 'rb') 
        self.send_response(200)
        self.send_header("Content-type", "image/png")
        self.send_header('Access-Control-Allow-Origin','*')
        self.end_headers()  
        self.wfile.write(f.read())
        f.close()
        shutil.rmtree(jobDir)
        return


    def deal_post_data(self, jobId):
        ctype, pdict = cgi.parse_header(self.headers['Content-Type'])
        pdict['boundary'] = bytes(pdict['boundary'], "utf-8")
        pdict['CONTENT-LENGTH'] = int(self.headers['Content-Length'])
        filename = None
        if ctype == 'multipart/form-data':
            form = cgi.FieldStorage( fp=self.rfile, headers=self.headers, environ={'REQUEST_METHOD':'POST', 'CONTENT_TYPE':self.headers['Content-Type'], })
            try:
                filename = os.path.join(TEMP_DIR, jobId, IN_DIR, form["file"].filename)
                open(filename, "wb").write(form["file"].file.read())
            except IOError:
                print("Can't create file upload")
                return False, None
        print("Upload save success")
        return True, filename


if __name__ == "__main__":
    Handler = CustomHTTPRequestHandler
    if not os.path.exists(TEMP_DIR):
        os.mkdir(TEMP_DIR)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("Serving at port", PORT)
        httpd.serve_forever()
