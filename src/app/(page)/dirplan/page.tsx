"use server";
import { DefineLevel } from "@/util/checkout";
import { filterByPermissionLevels } from "@/util/checkout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/util/prisma";
import { ListPage } from "@/components/page/listpage";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;
  const session = await getServerSession(authOptions);
  const data = await prisma.authUser.findUnique({
      where: {
        id: Number(session?.user.id),
      },
      include: {
        employee: true,
      },
    });
    const record = await prisma.employee.findUnique({
      where: {
        id: data?.employee?.id
      },
      select: {
        jobPosition: {
          select: {
            jobPositionGroup: true
          }
        },
        departmentEmployeeRole: {
          include: {
            document: {
              include: {
                user: {
                  select: {
                    employee: {
                      select: {
                        firstname: true,
                        lastname: true,
                      },
                    },
                  },
                },
              },
            },
    
          }
        }
      }
    })

 
     
  const level2 = Array(record).filter((item)=>item?.jobPosition?.jobPositionGroup?.jobAuthRank === 2)
  const level4 = Array(record).filter((item)=>item?.jobPosition?.jobPositionGroup?.jobAuthRank === 4)
  const level6 = Array(record).filter((item)=>item?.jobPosition?.jobPositionGroup?.jobAuthRank === 6)
  let result = [...level4]

  if (level2.length && level2.every((item:any) => item.rode === true)) {
    result = result.concat(level4);

    if (level4.length && level4.every((item:any) => item.rode === true)) {
      result = result.concat(level6);
    }
  }

  console.log(result)
  //const record = await prisma.$transaction(async (tx) => {
    // const data = await tx.authUser.findUnique({
    //   where: {
    //     id: Number(session?.user.id),
    //   },
    //   include: {
    //     employee: true,
    //   },
    // });
    
    
    // const list = await tx.departmentEmployeeRole.findMany({
    //   distinct: ["employeeId"],
    //   orderBy: {
    //     document: {
    //       timeCreated: "desc",
    //     },
    //   },
    //   where:{
    //     employeeId: data?.employee?.id
    //   },
    //   include: {
    //     employee: {
    //       include: {
    //         jobPosition: {
    //           select: {
    //             jobPositionGroup: true,
    //           },
    //         },
    //       },
    //     },
    //     document: {
    //       include: {
    //         user: {
    //           select: {
    //             employee: {
    //               select: {
    //                 firstname: true,
    //                 lastname: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // const dataWithLevels = list.map((item) => ({
    //   ...item,
    //   level: DefineLevel(
    //     item.employee?.jobPosition?.jobPositionGroup?.name || ""
    //   ),
    // }));

    // const filteredData = filterByPermissionLevels(dataWithLevels).filter(
    //   (item: any) => item.employeeId === data?.employee?.id
    // );

    // return list;
  //});

  

  // const totalCount = record.length;
  const totalCount=result.length

  return (
    <ListPage
      data={result}
      total={totalCount}
      page={page}
      pageSize={pageSize}
    />
  );
}
