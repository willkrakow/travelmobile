import { Button, Input, Text } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';
import { inter, lobsterTwo } from '../constants/fonts';
import useAccount from '../hooks/useAccount';
import { isNil } from '../utils/common';


const SignInScreen = () => {
    const [email, setEmail] = React.useState<string>();
    const [pw, setPw] = React.useState<string>();
    const {handleAnonSignIn,handleSignIn,handleSignUp} = useAccount(email, pw)


    const disableButtons = React.useMemo(() => {
        if(isNil(email) || email?.length === 0 || isNil(pw) || pw?.length === 0) return true;

        return false
    }, [email, pw])

    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: "center",
            paddingTop: 20,
            paddingBottom: 20,
            fontFamily: "Inter-Thin",
          }}
        >
          Tripr
        </Text>
        <View style={{ padding: 10 }}>
          <Input
            onChangeText={(t) => setEmail(t)}
            label="Email"
            textContentType="emailAddress"
            value={email}
            autoCapitalize={"none"}
            autoCorrect={false}
          />
          <Input
            onChangeText={(t) => setPw(t)}
            label="Password"
            textContentType="password"
            secureTextEntry
            value={pw}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={{}}>
            <Button
              containerStyle={{ padding: 10 }}
              disabled={disableButtons}
              type="solid"
              color="secondary"
              onPress={handleSignIn}
              title="Sign In"
            />
            <Button
              containerStyle={{ padding: 10 }}
              disabled={disableButtons}
              type="solid"
              color="primary"
              onPress={handleSignUp}
              title="Sign Up"
            />
            <Button
              containerStyle={{ padding: 10 }}
              type="outline"
              color="primary"
              onPress={handleAnonSignIn}
              title="Continue as guest"
            />
          </View>
        </View>
      </View>
    );
}

export default SignInScreen