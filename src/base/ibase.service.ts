export interface IBaseService<T> {
  create(model): Promise<T>;
  updateOne(id: string, model): Promise<T>;
  delete(id: string);
  getAll(filter): Promise<T[]>;
  getItemById(id: string): Promise<T>;
  getItemByQuery(query): Promise<T[]>;
}
