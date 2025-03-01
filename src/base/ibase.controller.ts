export interface IBaseController<EntityType, CreateDto, UpdateDto> {
  findById(id: string, option?: any): Promise<EntityType>;

  findAll(filter): Promise<EntityType[]>;

  create(body: CreateDto, option?: any): Promise<EntityType>;

  update(id: string, body: UpdateDto, option?: any): Promise<EntityType>;

  delete(id: string, option?: any): Promise<Partial<EntityType>>;
}
