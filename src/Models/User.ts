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
import { People } from "./People";
import { Plan } from "./Plan";
    
  @Table({
    timestamps: true,
  })
  export class User extends Model<User> {

    @PrimaryKey
    @Column(DataType.STRING)
    public id: String;

    @ForeignKey(() => People)
    @Column(DataType.STRING)
    public PeopleId: string;

    @ForeignKey(() => Plan)
    @Column(DataType.STRING)
    public PlanId: string;

    @AllowNull(true)
    @Column(DataType.BOOLEAN) public active: boolean;
  
    @AllowNull(true)
    @Unique
    @Column(DataType.STRING) public userName: string;
  
    @AllowNull(true)
    @Column(DataType.STRING) public password: string;

    @BelongsTo(() => People)
    public people: People;

    @BelongsTo(() => Plan)
    public plan: Plan;

  }
  