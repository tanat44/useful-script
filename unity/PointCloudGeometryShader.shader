Shader "Geometry/PointCloud"
{
    Properties
    {
        _MainTex("Texture", 2D) = "white" {}
        _PointSize("Point Size", float) = 0.1
    }
    SubShader
    {
        Tags { "RenderType" = "Opaque" }
        Cull Off
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma geometry geom
            #pragma fragment frag
            // make fog work
            #pragma multi_compile_fog

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2g
            {
                float4 vertex : SV_POSITION;
                float2 uv : TEXCOORD0;
            };

            struct g2f
            {
                float2 uv : TEXCOORD0;
                UNITY_FOG_COORDS(1)
                float4 vertex : SV_POSITION;
                float4 color : COLOR;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;
            float _PointSize;

            v2g vert(appdata v)
            {
                v2g o;
                o.vertex = v.vertex;
                o.uv = v.uv;
                return o;
            }

            [maxvertexcount(3)]
            void geom(point v2g IN[1], inout TriangleStream<g2f> triStream)
            {
                float4 v;

                g2f o;
                o.uv = TRANSFORM_TEX(IN[0].uv, _MainTex);
                o.color = fixed4(0.0, 0.0, 0.0, 1.0);

                // RIGHT
                v = UnityObjectToClipPos(IN[0].vertex);
                v.x += _PointSize/2;
                v.y -= _PointSize;
                o.vertex = v
                UNITY_TRANSFER_FOG(o, o.vertex);
                triStream.Append(o);

                // LEFT
                v.x -= _PointSize;
                o.vertex = v
                UNITY_TRANSFER_FOG(o, o.vertex);
                triStream.Append(o);

                // TOP
                v.x += _PointSize/2;
                v.y += _PointSize;
                o.vertex = v
                UNITY_TRANSFER_FOG(o, o.vertex);
                triStream.Append(o);

                triStream.RestartStrip();
            }

            fixed4 frag(g2f i) : SV_Target
            {
                // sample the texture
                //fixed4 col = tex2D(_MainTex, i.uv) * i.color;
                    fixed4 col = fixed4(0.9, 0.7, 0.1, 1);
                // apply fog
                UNITY_APPLY_FOG(i.fogCoord, col);
                return col;
            }
            ENDCG
        }
    }
}
