using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class ForkLiftPath : MonoBehaviour
{
    public Transform[] path;
    public float speed = 0.5f;
    public float reachDist = 1.0f;
    public int currentPoint = 0;

    void Start()
    {
        
    }
    void Update()
    {
        if (path.Length == 0)
            return;

        int previousIndex = currentPoint - 1;
        if (previousIndex < 0)
        {
            previousIndex = path.Length - 1;
        }
        Vector3 previousPoint = path[previousIndex].position;

        float dist = Vector3.Distance(path[currentPoint].position, transform.position);
        transform.position = Vector3.Lerp(transform.position, path[currentPoint].position, Time.deltaTime * speed);

        Vector3 direction = path[currentPoint].position - previousPoint;
        direction = Vector3.RotateTowards(transform.forward, direction, 2.0f, 0.0f);
        transform.rotation = Quaternion.LookRotation(direction) * Quaternion.Euler(0, -90, 0);


        if (dist <= reachDist)
        {
            ++currentPoint;
        }
        if (currentPoint >= path.Length)
        {
            currentPoint = 0;
        }
    }

    private void OnDrawGizmos()
    {
        if (path.Length < 0)
        {
            return;
        }
        for (int i=0; i < path.Length; ++i)
        {
            if (path[i] != null)
            {
                Gizmos.DrawSphere(path[i].position, reachDist);
            }
        }
    }
}
