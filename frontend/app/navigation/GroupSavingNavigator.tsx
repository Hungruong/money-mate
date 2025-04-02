//Create Stack Navigator
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { create } from "react-test-renderer";
//Setup screen
import GroupSavingScreen from "../screens/GroupSaving";
import GroupCreate from "../screens/GroupSaving/groupCreate";
import GroupHome from "../screens/GroupSaving/groupHome";
import { GroupMemProfile } from "../screens/GroupSaving/groupModify";
import { GroupMemberRemove } from "../screens/GroupSaving/groupModify";
import { SetRule } from "../screens/GroupSaving/groupModify";
import { GroupDelete } from "../screens/GroupSaving/groupModify";
import { SetGoal } from "../screens/GroupSaving/groupModify";
export type GroupSavingStackParamList = {
  GroupSavingHome: undefined;
  GroupCreate: undefined;
  GroupHome: undefined;
  GroupMemProfile: undefined;
  GroupMemberRemove: undefined;
  SetRule: undefined;
  GroupDelete: undefined;
  SetGoal: undefined;
};

const GroupSavingStack = createStackNavigator<GroupSavingStackParamList>();

export default function GroupSavingNavigator() {
  return (
    <GroupSavingStack.Navigator>
      <GroupSavingStack.Screen
        name="GroupSavingHome"
        component={GroupSavingScreen}
      />
      <GroupSavingStack.Screen name="GroupCreate" component={GroupCreate} />
      <GroupSavingStack.Screen name="GroupHome" component={GroupHome} />
      <GroupSavingStack.Screen
        name="GroupMemProfile"
        component={GroupMemProfile}
      />
      <GroupSavingStack.Screen
        name="GroupMemberRemove"
        component={GroupMemberRemove}
      />
      <GroupSavingStack.Screen name="SetRule" component={SetRule} />
      <GroupSavingStack.Screen name="GroupDelete" component={GroupDelete} />
      <GroupSavingStack.Screen name="SetGoal" component={SetGoal} />
    </GroupSavingStack.Navigator>
  );
}
