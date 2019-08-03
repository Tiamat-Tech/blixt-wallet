import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Content, View, Item, Text, Label } from "native-base";

export interface IFormItem {
  title: string | null;
  component: ReactNode;
  key: string | number;
  success?: boolean;
}

export interface IFormProps {
  buttons: ReactNode[];
  items: IFormItem[];
}

export default ({ buttons, items }: IFormProps) => (
  <Content contentContainerStyle={style.content}>
    <View style={style.itemContainer}>
      {items.map(({ key, title, component, success }, i) => (
        <Item key={key} style={{ marginTop: i > 0 ? 16 : 8 }} success={success}>
          <Label style={style.itemLabel}>{title}</Label>
          {component}
        </Item>
      ))}
    </View>
    <View style={style.buttonContainer}>
      {buttons.map((button, i) => {
        return (<View key={i} style={{ marginTop: i > 0 ? 10 : 0 }}>{button}</View>);
      })}
    </View>
  </Content>
);

const style = StyleSheet.create({
  content: {
    height: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    padding: 24,
  },
  itemContainer: {
  },
  itemLabel: {
    width: 110,
  },
  buttonContainer: {
    marginBottom: 2,
  },
});