using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PointCloudCamera : MonoBehaviour
{
    float rotationOnX;
    float rotationOnY;
    float mouseSensitivity = 500f;
    public float walkSpeed = 10f;

    public Vector2 clickOrigin;
    public bool dragging;
    void Start()
    {

    }

    void Update()
    {

        Vector2 currentPos = new Vector2(Input.GetAxis("Mouse X"), Input.GetAxis("Mouse Y"));
        if (Input.GetMouseButton(0))
        {
            if (!dragging)
            {
                clickOrigin = currentPos;
                dragging = true;
            }
            else
            {
                Vector2 delta = (currentPos - clickOrigin) * Time.deltaTime * mouseSensitivity;

                rotationOnX += delta.y;
                rotationOnX = Mathf.Clamp(rotationOnX, -90f, 90f);

                rotationOnY -= delta.x;
                rotationOnY = Mathf.Clamp(rotationOnY, -90f, 90f);

                transform.localEulerAngles = new Vector3(rotationOnX, rotationOnY, 0f);
            }
        } else
        {
            dragging = false;
        }
            


        Vector3 pos = transform.position;

        if (Input.GetKey("w"))
        {
            pos += transform.forward * walkSpeed * Time.deltaTime; ;
        }
        if (Input.GetKey("s"))
        {
            pos -= transform.forward * walkSpeed * Time.deltaTime; ;
        }
        if (Input.GetKey("d"))
        {
            pos += transform.right * walkSpeed * Time.deltaTime; ;
        }
        if (Input.GetKey("a"))
        {
            pos -= transform.right * walkSpeed * Time.deltaTime; ;
        }

        transform.position = pos;


    }
}
