import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    HasOne,
    Length,
    Model,
    PrimaryKey,
    Table,
    Unique,
  } from "sequelize-typescript";
import { User } from "./User";
    
  @Table({
    timestamps: true,
  })
  export class Plan extends Model<Plan> {

    @PrimaryKey
    @Column(DataType.STRING)
    public id: String;
  
    @AllowNull(true)
    @Unique
    @Column(DataType.STRING) public name: string;
  
    @HasOne(() => User)
    public user: User;

  }
  