import { Column, Model, Table, DataType } from 'sequelize-typescript';

// Interface pour créer une tâche
export interface TaskCreationAttrs {
  shortDescription: string;
  longDescription?: string;
  dueDate: Date;
  listId: number;
  userId: number;
}

@Table({
  tableName: 'tasks',
  timestamps: true,
})
export class Task extends Model<Task, TaskCreationAttrs> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare shortDescription: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare longDescription: string | null;

  @Column({ type: DataType.DATE, allowNull: false })
  declare dueDate: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare completed: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare listId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;
}
