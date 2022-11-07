import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useTheme } from "native-base";
import { PlusCircle, SoccerBall } from "phosphor-react-native";
import { Platform } from "react-native";
import { Details } from "../screens/Details";
import { Find } from "../screens/Find";
import { New } from "../screens/New";
import { Pools } from "../screens/Pools";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const { colors, sizes } = useTheme();
    const size = sizes[6];

    return (
        <Navigator screenOptions={{ 
            headerShown: false, 
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarLabelPosition: "beside-icon",
            tabBarStyle: {
                position: "absolute",
                height: sizes[22],
                borderTopWidth: 0,
                backgroundColor: colors.gray[800]
            },
            tabBarItemStyle: {
                position: "relative",
                top: Platform.OS == "android" ? -10 : 0
            }
        }}>
            <Screen name="New" component={New} 
                options={{
                    tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
                    tabBarLabel: "criar novo bolão"
                }}
            />
            <Screen name="Pools" component={Pools}
                options={{
                    tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
                    tabBarLabel: "Meus bolões"
                }}
            />
            <Screen name="Find" component={Find} options={{ tabBarButton: () => null }} />
            <Screen name="Details" component={Details} options={{ tabBarButton: () => null }} />
        </Navigator>
    )
}