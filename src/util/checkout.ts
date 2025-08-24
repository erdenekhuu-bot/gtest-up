import { prisma } from "@/util/prisma";
import { AuthUser, Permission } from "@prisma/client";
import { encrypt } from "@/modules/auth_service";
import axios from "axios";

const ERP_SECRET_KEY: string = "559737a789948385c8feba94cb561803";
const ERP_CORE_BASE_URL = "http://192.168.200.216:8080";
const ERP_SYSTEM_ID = "13";

export async function CheckErp(arg: string, user: AuthUser) {
  const levels: any = {
    "Ерөнхий захирал": 6,
    "Дэд захирал": 5,
    "Газрын захирал": 4,
    "Газрын дэд захирал": 3,
    "Хэлтсийн дарга": 2,
    Менежер: 1,
    Инженер: 0,
  };

  if (!arg) return 0;
  return MakePermission(user, levels[arg]);
}

export async function MakePermission(user: any, permissionId: number) {
  try {
    const record = await prisma.authUserData.findUnique({
      where: {
        authUserId: user.id,
      },
    });
    const permissionLevels: any = {
      6: [
        "index_create",
        "index_read",
        "index_update",
        "index_delete",
        "index_add",
        "index_all",
      ],
      5: [
        "index_create",
        "index_read",
        "index_update",
        "index_delete",
        "index_add",
      ],
      4: ["index_create", "index_read", "index_update", "index_delete"],
      3: ["index_create", "index_read"],
      2: ["index_create", "index_read"],
      1: ["index_read"],
      0: ["index_read"],
    };
    const permission = await prisma.permission.upsert({
      where: {
        id: record?.authUserId,
      },
      create: {
        id: user.id,
        kind: permissionLevels[permissionId],
      },
      update: {
        kind: permissionLevels[permissionId],
      },
    });

    return permission;
  } catch (error) {
    return -1;
  }
}

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

type JobPosition =
  | "Ерөнхий захирал"
  | "Дэд захирал"
  | "Газрын захирал"
  | "Газрын дэд захирал"
  | "Хэлтсийн дарга"
  | "Менежер"
  | "Инженер";

export function DefineLevel(arg: string): number {
  const levels: Record<JobPosition, number> = {
    "Ерөнхий захирал": 6,
    "Дэд захирал": 5,
    "Газрын захирал": 4,
    "Газрын дэд захирал": 3,
    "Хэлтсийн дарга": 2,
    Менежер: 1,
    Инженер: 0,
  };

  if (!arg) return 0;
  return levels[arg as JobPosition] ?? 0;
}

export function filterByPermissionLevels(dataWithLevels: any[]) {
  const level2 = dataWithLevels.filter((item) => item.level === 2);
  const level4 = dataWithLevels.filter((item) => item.level === 4);
  const level6 = dataWithLevels.filter((item) => item.level === 6);

  let result = [...level2];

  if (level2.length && level2.every((item) => item.rode === true)) {
    result = result.concat(level4);

    if (level4.length && level4.every((item) => item.rode === true)) {
      result = result.concat(level6);
    }
  }

  return result;
}
// export function filterByPermissionLevels(dataWithLevels: any[]) {
//   if (!dataWithLevels?.length) return [];

//   const levels = dataWithLevels.reduce((acc, item) => {
//     if (!acc[item.level]) acc[item.level] = [];
//     acc[item.level].push(item);
//     return acc;
//   }, {} as Record<number, any[]>);

//   const result = [...(levels[2] || [])];

//   if (result.length > 0 && result.every((item) => item.rode)) {
//     const level4Items = levels[4] || [];
//     result.push(...level4Items);

//     if (level4Items.length > 0 && level4Items.every((item: any) => item.rode)) {
//       result.push(...(levels[6] || []));
//     }
//   }

//   return result;
// }
