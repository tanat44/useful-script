using System.Collections;
using System;
using UnityEngine;
using UnityEngine.Networking;
using System.Threading.Tasks;

public class Http : MonoBehaviour
{
    [Serializable]
    public class Response
    {
        public bool ok;
        public string data;
        public string msg;
    }
    public static IEnumerator Get(string uri, Action<Response> callback)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(uri))
        {
            
            yield return webRequest.SendWebRequest();
            string output = "";
            Response res = new Response();

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError(webRequest.error);
                res.ok = false;
                res.msg = webRequest.error;
            }
            else
            {
                output = webRequest.downloadHandler.text;
                res = JsonUtility.FromJson<Response>(output);
            }
            callback(res);
        }
    }
    public static IEnumerator Get(string uri, Action<byte[]> callback)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(uri))
        {

            yield return webRequest.SendWebRequest();
            byte[] results;

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError(webRequest.error);
                results = new byte[1];
                results[0] = 0;
            }
            else
            {
                results = webRequest.downloadHandler.data;
            }
            callback(results);
        }
    }

    public static async Task<string> GetAsync(string uri)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(uri))
        {
            webRequest.SendWebRequest();

            while (!webRequest.isDone)
                await Task.Yield();

            return webRequest.downloadHandler.text;
        }
    }
}
