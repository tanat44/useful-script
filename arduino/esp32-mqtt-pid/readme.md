## node > master

**generic**
- node/join
- node/bye

**encoder**
- <node_id>/encoder/1
  - content: raw vel acc

**motor**
- <node_id>/motor/1/pos/pid
  - content: kp ki kd

**debug**
- <node_id>/info
- <node_id>/error

## master > node

**motor**
- <node_id>/motor/1/pwm
- <node_id>/motor/1/pos
- <node_id>/motor/1/pos/<kp|ki|kd>
- <node_id>/motor/1/pos/pid/req