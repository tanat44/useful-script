import "./encoder";
import "./main.css";
import "./motor/autotune";
import { testOscillation } from "./motor/autotune";
import "./motor/position";
import "./motor/pwm";
import "./mqtt";

document.getElementById("testOscillation").onclick = testOscillation;
