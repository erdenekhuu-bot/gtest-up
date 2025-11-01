type FieldType = {
  username: string;
  password: string;
};

type DataType = {
  key: React.Key;
  id: number;
  generate: string;
  user: object;
  title: string;
  statement: string;
  timeCreated: string;
  state: string;
};


type TablePagination = {
    data: any[];
    total: number;
    page: number;
    pageSize: number;
}