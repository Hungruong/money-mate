//Create Stack Navigator
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { create } from "react-test-renderer";
//Setup screen
import GroupSavingScreen from "../screens/GroupSaving";
import GroupCreate from '../screens/GroupSaving/groupCreate';
import GroupHome from '../screens/GroupSaving/groupHome';
import {GroupMemProfile} from '../screens/GroupSaving/groupModify';
import {GroupMemberRemove} from '../screens/GroupSaving/groupModify';
import {SetRule} from '../screens/GroupSaving/groupModify';
import {GroupDelete} from '../screens/GroupSaving/groupModify';
import {SetGoal} from '../screens/GroupSaving/groupModify';
import Contribute from "../screens/GroupSaving/groupContribution";
import ProfileScreen from "../screens/profile/Profile";
import MemberProfile from "../screens/GroupSaving/groupMemberProfile";
export type GroupSavingStackParamList = {
  GroupSavingHome: undefined;
  PlanDetails:{planId:string};
  PlanCreate:undefined
  GroupCreate: undefined;
  GroupHome:{planId:string};
  GroupMemProfile:undefined;
  GroupMemberRemove:undefined;
  SetRule:{planId:string};
  GroupDelete:{planId:string};
  SetGoal:{planId:string};
  Contribute:{planId:string, refreshContribution?:()=>Promise<void>};
  Profile:undefined;
  MemberProfile:{planId: string,userId:string}
  
};

const GroupSavingStack = createStackNavigator<GroupSavingStackParamList>();

export default function GroupSavingNavigator() {
  return (
    <GroupSavingStack.Navigator>
      <GroupSavingStack.Screen name="GroupSavingHome" component={GroupSavingScreen} />
      
      <GroupSavingStack.Screen name="GroupCreate" component={GroupCreate} />
      <GroupSavingStack.Screen name="GroupHome" component={GroupHome} />
      <GroupSavingStack.Screen name="GroupMemProfile" component={GroupMemProfile} />
      <GroupSavingStack.Screen name="GroupMemberRemove" component={GroupMemberRemove} />
      <GroupSavingStack.Screen name="SetRule" component={SetRule} />
      <GroupSavingStack.Screen name="GroupDelete" component={GroupDelete} />
      <GroupSavingStack.Screen name="SetGoal" component={SetGoal} />
      <GroupSavingStack.Screen name="Contribute" component={Contribute} />
      <GroupSavingStack.Screen name="Profile" component={ProfileScreen} />
      <GroupSavingStack.Screen name="MemberProfile" component={MemberProfile} />

    </GroupSavingStack.Navigator>
  );
}