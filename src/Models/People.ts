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
  } from "sequelize-typescript";
import { User } from "./User";
    
  @Table({
    timestamps: true,
  })
  export class People extends Model<People> {
    @PrimaryKey
    @Column(DataType.STRING)
    public id: String;
  
    @AllowNull(true)
    @Column(DataType.STRING) public name: string;
  
    @AllowNull(true)
    @Column(DataType.STRING) public phone: string;

    @AllowNull(true)
    @Column(DataType.STRING) public address: string;

    @AllowNull(true)
    @Column(DataType.STRING) public addressNumber: string;
  
    @AllowNull(true)
    @Column(DataType.STRING) public country: string;

    @AllowNull(true)
    @Column(DataType.STRING) public state: string;

    @HasOne(() => User, {onDelete: "CASCADE"})
    public user: User;

  }
  