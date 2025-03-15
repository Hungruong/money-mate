package com.money.mate.savings_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "saving_group")
public class SavingGroup {

    @Id
    @Column(groupId="groupId",unique=true)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID groupId;

    @Column(nullable = false)
    private UUID name;

    @Column(nullable = false)
    private UUID members;


    public SavingGroup(String groupId){
        this.groupId=groupId;
    }

    public SavingGroup(String groupId, String name, String members){
        this.groupId = groupId;
        this.name = name;
        this.members = members;
    }

    public SavingGroup(){

    }
    public String getGroupId(){
        return groupId;
    }
    public void setGroupId(){
        this.groupId=groupId
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name=name
    }
    public String getMembers(){
        return members;
    }
    public void setMembers(String members){
        this.members=members
    }


}
 