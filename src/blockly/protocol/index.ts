import { Protocol } from "./Protocol";
import "./PingHandler";

import "./HandshakeHandler";

import "./LicenseHandler";
import "../../handler/UcmdHandler";
import "../../handler//UcumHandler";
import "../../handler//OpenHandler";
import "../../handler//WriteHandler";
import "../../handler//CloseHandler";
import "../../handler//StartHandler";

export const protocol = new Protocol();
