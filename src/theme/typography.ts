import { TextStyle } from 'react-native';

export const typography = {
  prompt: {
    fontSize: 20,
    lineHeight: 30,
    fontStyle: 'italic',
    color: '#7A7A7A',
  } as TextStyle,
  body: {
    fontSize: 17,
    lineHeight: 26,
    color: '#2C2C2C',
  } as TextStyle,
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C2C2C',
  } as TextStyle,
  caption: {
    fontSize: 13,
    color: '#7A7A7A',
  } as TextStyle,
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,
};
