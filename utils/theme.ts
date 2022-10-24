import {createTheme, lightColors} from '@rneui/themed';
export const colors = createTheme({
    lightColors: {
        primary: "#db3498",
    }
})
export const theme = createTheme({
  ...colors,
  components: {
    Card: {
      containerStyle: {
        borderRadius: 20,
        shadowColor: lightColors.black,
        padding: 0,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      wrapperStyle: {
        borderRadius: 20,
      },
    },
    CardTitle: {
      style: {
        fontSize: 25,
        fontFamily: "Inter-Bold",
        color: lightColors.primary,
        marginTop: 10,
      },
    },
    CardImage: {
      borderRadius: 10,
      containerStyle: {
        shadowColor: lightColors.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    },
    Input: {
      containerStyle: {
        borderRadius: 10,
      },
      style: {
        padding: 5,
      },
      inputContainerStyle: {
        borderBottomWidth: 2,
        borderBottomColor: lightColors.primary,
        borderStyle: "solid",
        borderColor: lightColors.primary,
      },
      labelStyle: {
        fontFamily: "Inter-Regular"
      },
      inputStyle: {
        fontFamily: "Inter-Regular"
      }
    },
    Button: {
      containerStyle: {
        shadowColor: lightColors.black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        overflow: "hidden",
        borderRadius: 10,
      },
      color: lightColors.primary,
      style: {
        borderRadius: 10,
      },
      buttonStyle: {
        borderRadius: 10,
      },
      titleStyle: {
        textTransform: "uppercase",
        letterSpacing: 1,
        fontFamily: "Inter-Bold"
      },
    },
    ListItemTitle: {
      h1Style: {
        fontFamily: "Inter-Regular"
      },
      h2Style: {
        fontFamily: "Inter-Regular"
      },
      h3Style: {
        fontFamily: "Inter-Regular"
      },
      h4Style: {
        fontFamily: "Inter-Regular"
      },
      style: {
        fontSize: 20,
        color: lightColors.black,
        fontFamily: "Inter-Regular"
      },
    },
    ListItemSubtitle: {
      style: {
        fontFamily: "Inter-Regular"
      }
    },
    Text: {
      h1Style: {
        color: colors.lightColors?.primary,
        fontFamily: "Inter-Black",
      },
      h2Style: {
        color: colors.lightColors?.primary,
        fontFamily: "Inter-Bold",
      },
      h3Style: {
        color: colors.lightColors?.primary,
        fontFamily: "Inter-Bold",
      },
      h4Style: {
        color: colors.lightColors?.primary,
        fontFamily: "Inter-Bold",
      },
    },
    SearchBar: {
      inputContainerStyle: {
        borderRadius: 20,
        marginTop: 5,
        overflow: "hidden",
      },
      inputStyle: {
        fontFamily: "Inter-Regular",
      }
    },
  },
});