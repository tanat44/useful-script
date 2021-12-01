import { Component, ViewChild, OnDestroy, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { ScriptService } from './script.service';
import { WebsocketService } from './websocket.service';
declare let createUnityInstance: any;

@Component({
  selector: 'unity',
  templateUrl: './unity.component.html',
  styleUrls: ['./unity.component.css']
})

export class UnityComponent implements OnDestroy {
  @ViewChild('unityCanvas', { static: true }) unityCanvas: ElementRef<HTMLCanvasElement>;
  @Input() set open(value: boolean) {

    if (value) {
      this.scriptService.load('webloader').then(data => {
        createUnityInstance(document.querySelector("#unityCanvas"), {
          dataUrl: "assets/unity/Web.data",
          frameworkUrl: "assets/unity/Web.framework.js",
          codeUrl: "assets/unity/Web.wasm",
          streamingAssetsUrl: "StreamingAssets",
          companyName: "company",
          productName: "product",
          productVersion: "1.0",
        }).then((instance) => {
          this.unityInstance = instance
        }).catch((message) => {
          alert(message);
        });
      }).catch(error => console.log(error));     

    } else {

      // Close unityinstance
      if (this.unityInstance) {
        try{
          this.unityInstance.Quit();
        } catch(e){}        
        this.unityInstance = null;

        // Clear WebGL Canvas
        let gl:any = this.unityCanvas.nativeElement.getContext('webgl2');
        gl.clearColor(1.0, 1.0, 1.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }        
    }
  }
  @Output() ready = new EventEmitter<any>();

  wsSubject = null;         // For Unity development. Requires Web-socket server to work.
  wsDebug = false;          // Set to true for web-socket development
  scriptService;
  unityInstance = null;


  constructor(scriptService: ScriptService, wsService: WebsocketService) { 
    this.scriptService = scriptService;

    // For debugging WS messages 
    if (this.wsDebug)
      this.wsSubject = wsService.connect("ws://localhost:3000");
    // this.wsSubject.subscribe(msg=>{
    //   console.log("WS", msg)
    // })
  }

  ngOnDestroy(){
    if (this.unityInstance)
      this.unityInstance.Quit();
    console.log("Unity destroy")
  }

  onUnityReady(){
    console.log("Receive Unity Callback")
    this.ready.emit()
    // this.unityInstance.SendMessage('Director', 'SomePublicFunction', 1)
  }

  downloadJson(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  sendUnityMessage(jsonMsg) {
    if (this.wsDebug){
      this.wsSubject.next(jsonMsg)
      // this.downloadJson(JSON.stringify(jsonMsg), 'dto.json', 'text/plain');
    }

    if (!this.unityInstance)
      return

    const stringMsg = JSON.stringify(jsonMsg)
    this.unityInstance.SendMessage('Director', 'HandleJsMessage', stringMsg)
    
  }
}