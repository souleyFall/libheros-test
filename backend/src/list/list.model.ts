import { Column, Model, Table, DataType } from 'sequelize-typescript';

// Interface pour créer une liste
export interface ListCreationAttrs {
  title: string;
  userId: number;
}

@Table({
  tableName: 'lists',
  timestamps: true,
})
export class List extends Model<List, ListCreationAttrs> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;
}
