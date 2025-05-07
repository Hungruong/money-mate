// //Create Stack Navigator
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// //Setup screen
import BillSplitScreen from "../screens/BillSplit";
import GroupCreate from "../screens/BillSplit/groupCreate";
import { GroupHome, InviteMember } from "../screens/BillSplit/groupHome";
import { GroupMemProfile } from "../screens/GroupSaving/groupModify";
import { GroupMemberRemove } from "../screens/GroupSaving/groupModify";
import { GroupDelete } from "../screens/GroupSaving/groupModify";
import TransactionCreate from "../screens/BillSplit/transactionCreate";
import TransactionView from "../screens/BillSplit/transactionView";
import ReceiptScan from "../screens/BillSplit/receiptScan";

export type BillSplitStackParamList = {
  BillSplitHome: undefined;
  GroupCreate: undefined;
  GroupHome: undefined;
  GroupMemProfile: undefined;
  GroupMemberRemove: undefined;
  GroupDelete: undefined;
  AddTransaction: undefined;
  ViewTransactions: undefined;
  InviteMember: undefined;
  ReceiptScan: undefined;
};

const BillSplitStack = createStackNavigator<BillSplitStackParamList>();

export default function BillSplitNavigator() {
  return (
    <BillSplitStack.Navigator>
      <BillSplitStack.Screen name="BillSplitHome" component={BillSplitScreen} />
      <BillSplitStack.Screen name="GroupCreate" component={GroupCreate} />
      <BillSplitStack.Screen name="GroupHome" component={GroupHome} />
      <BillSplitStack.Screen
        name="GroupMemProfile"
        component={GroupMemProfile}
      />
      <BillSplitStack.Screen
        name="GroupMemberRemove"
        component={GroupMemberRemove}
      />
      <BillSplitStack.Screen name="GroupDelete" component={GroupDelete} />
      <BillSplitStack.Screen
        name="AddTransaction"
        component={TransactionCreate}
      />
      <BillSplitStack.Screen
        name="ViewTransactions"
        component={TransactionView}
      />
      <BillSplitStack.Screen name="InviteMember" component={InviteMember} />
      <BillSplitStack.Screen name="ReceiptScan" component={ReceiptScan} />
    </BillSplitStack.Navigator>
  );
}
