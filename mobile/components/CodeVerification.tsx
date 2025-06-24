import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { Text, View } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

interface VerificationCodeInputProps {
  value: string;
  setValue: (value: string) => void;
}

export const VerificationCodeInput = ({ value, setValue }: VerificationCodeInputProps) => {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={{ marginVertical: Spacing.md }}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <View
          key={index}
          style={{
            width: 40,
            height: 50,
            // lineHeight: 48,
            // fontSize: 24,
            borderWidth: 1,
            borderColor: isFocused ? Colors.accent : Colors.blueVariations.aliceBlue,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 4,
            borderRadius: 6,
          }}
        >
          <Text>{symbol || (isFocused ? <Cursor /> : null)}</Text>
        </View>
      )}
    />
  );
};
