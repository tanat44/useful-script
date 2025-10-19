export const NODE_ID = "myesp";
export const TOPIC_INFO = `${NODE_ID}/info`;
export const TOPIC_ERROR = `${NODE_ID}/info`;
export const TOPIC_ENCODER = `${NODE_ID}/encoder/1`;
export const TOPIC_MOTOR = `${NODE_ID}/motor/1`;
export const TOPIC_MOTOR_PWM = `${TOPIC_MOTOR}/pwm`;
export const TOPIC_MOTOR_POS = `${TOPIC_MOTOR}/pos`;
export const TOPIC_MOTOR_POS_PID = `${TOPIC_MOTOR_POS}/pid`;
export const TOPIC_MOTOR_POS_PID_REQ = `${TOPIC_MOTOR_POS_PID}/req`;
export const TOPICS = [
  TOPIC_INFO,
  TOPIC_ERROR,
  TOPIC_ENCODER,
  TOPIC_MOTOR_POS_PID,
];
