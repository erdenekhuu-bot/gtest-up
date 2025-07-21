import { prisma } from "@/util/prisma";
import axios from "axios";
import * as crypto from "crypto";

export type AuthCorePermissionType = {
  system_id: string;
  module: string;
  action: string;
};

const ERP_SECRET_KEY: string = "559737a789948385c8feba94cb561803";
const ERP_CORE_BASE_URL = "http://192.168.200.216:8080";
const ERP_SYSTEM_ID = "13";

export function encrypt(data: string) {
  const key = crypto
    .createHash("md5")
    .update(Buffer.from(ERP_SECRET_KEY, "utf8"))
    .digest("hex")
    .substr(0, 24);
  const cipher2 = crypto.createCipheriv("des-ede3", key, Buffer.alloc(0));
  const encData = cipher2.update(data, "utf-8", "hex") + cipher2.final("hex");
  return Buffer.from(encData, "hex").toString("base64");
}

export function decrypt(data: string) {
  const key = crypto
    .createHash("md5")
    .update(Buffer.from(ERP_SECRET_KEY, "utf8"))
    .digest("hex")
    .substr(0, 24);
  const decipher = crypto.createDecipheriv("des-ede3", key, Buffer.alloc(0));
  let decrypted: string = decipher.update(
    Buffer.from(data, "base64"),
    undefined,
    "utf8"
  );
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function storePermissions(authUserId: number) {
  const reqModel = {
    userId: authUserId,
  };

  const url = `${ERP_CORE_BASE_URL}/service.php/_api/scc/${ERP_SYSTEM_ID}/node/user/permissions`;
  const plainTextData = encrypt(JSON.stringify(reqModel));
  const { data } = await axios
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

  const permissionList = Array.isArray(data) ? data : [];
  const permissions: string[] = [];
  for (const per of permissionList) {
    permissions.push(`${per.module}_${per.action}`);
  }

  await savePermission(authUserId, permissions, data);
}

export async function savePermission(
  authUserId: number,
  permissions: string[],
  data: JSON[]
) {
  const authUserData = await prisma.authUserData.findUnique({
    where: { authUserId: authUserId },
  });
  const now = new Date();

  if (!authUserData) {
    await prisma.authUserData.create({
      data: {
        authUserId: authUserId,
        permissions: permissions,
        timeUpdated: now,
      },
    });
  } else {
    const permissionStrings = data.map(
      (item: any) => `${item.module}_${item.action}`
    );

    const isChanged =
      authUserData.authUserId !== authUserId ||
      JSON.stringify(authUserData.permissions) !==
        JSON.stringify(permissionStrings);

    if (isChanged) {
      await prisma.authUserData.update({
        where: { authUserId: authUserId },
        data: { permissions: permissions, timeUpdated: now },
      });
    } else {
    }
  }
}
