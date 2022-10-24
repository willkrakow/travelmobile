import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";

type IPrimaryIcon = {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color?: "primary" | "secondary" | "white";
    size?: number;
}
const ThemeIcon = ({name, color = 'primary', size = 20}: IPrimaryIcon) => {
    const {theme} = useTheme();

    return (
        <Ionicons name={name} color={theme.colors[color]} size={size} />
    )
}

export default ThemeIcon