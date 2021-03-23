import styled from '@emotion/native';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Platform, KeyboardTypeOptions, TouchableOpacity } from 'react-native';
import { Search } from '../../components/icon/home/Search';
import { TextFieldCancleIcon } from '../../components/icon/home/TextFieldCancleIcon';



type Props = {
    maxLength?: number;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    flex?: number;
    centered?: boolean;
};
export const HomeLocationTextField: React.FC<Props> = ({
                                               maxLength,
                                               placeholder,
                                               keyboardType,
                                               flex,
                                               centered,
                                           }) => {

    const [value, setValue] = useState("");

    return (
        <Box
            flex={flex}
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            placeholderTextColor="#b0b0b2"
            keyboardType={keyboardType}
            centered={centered}
        >
            <TouchableOpacity>
                <Search/>
            </TouchableOpacity>
            <LocationInput
                flex={flex}
                value={value}
                onChangeText={setValue}
                maxLength={maxLength}
                placeholder={placeholder}
                placeholderTextColor="#808083"
                keyboardType={keyboardType}
                centered={centered}
            />
            {/* <CancleView>
                <TouchableOpacity
                onPress={()=>{
                    setValue("");
                }}>
                <TextFieldCancleIcon
                    height= {Platform.OS === 'android' ? 13 : 0}
                    width= {Platform.OS === 'android' ? 13 : 0}
                />
                </TouchableOpacity>
            </CancleView> */}

        </Box>
    );
};

const Box = styled.View<{ flex?: number; centered?: boolean }>`
  height: 33px;
  width: 243px;
  margin-left: 10px;
  margin-right: 10px;
  border: 1px solid #B7B7BB;
  border-radius: 21px;
  font-size: 11px;
  color: #B7B7BB;
  background-color: #FFFFFF;
  flex-direction: row;
  align-items: center;
  padding: 0 10px 0 10px;
`;

const LocationInput = styled.TextInput<{ flex?: number; centered?: boolean }>`
  justify-content: center;
  padding: 0 0 2px 5px;
  font-size: 11px;
  color: #080808;
  placeholder-text-color="#808083"
`;