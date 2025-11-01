import { prisma } from "@/util/prisma";
import { AuthUser, Permission } from "@prisma/client";
import { encrypt } from "@/modules/auth_service";
import axios from "axios";

const ERP_SECRET_KEY: string = "559737a789948385c8feba94cb561803";
const ERP_CORE_BASE_URL = "http://192.168.200.216:8080";
const ERP_SYSTEM_ID = "13";


export async function DecryptAndChecking(params: any) {
  try {
    const url = `${ERP_CORE_BASE_URL}/service.php/_api/scc/${ERP_SYSTEM_ID}/node/user/check`;
    const plainTextData = encrypt(JSON.stringify(params));
    const { status, data } = await axios
      .post(url, plainTextData, {
        headers: {
          "Content-Type": "text/plain",
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });

    return { data, status };
  } catch (error) {
    return -1;
  }
}