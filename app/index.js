import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { getNote, shiftNote } from "../lib/transpose";

function FretSlider({ startingNote, backgroundColor, totalNotes }) {
  const screenFrame = useSafeAreaFrame();
  const safeAreaInsets = useSafeAreaInsets();

  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(15);

  const [note, setNote] = useState(startingNote);

  const sliderPadding = 0;
  const sliderThumbRadius = 30;
  const totalSafeArea = safeAreaInsets.top + safeAreaInsets.bottom;
  const textHeight = 30;
  const topSpace = 40;

  const sliderHeight =
    screenFrame.height -
    sliderPadding -
    totalSafeArea -
    sliderThumbRadius -
    textHeight -
    topSpace;

  const fretWidth = screenFrame.width / totalNotes;

  const onNoteChange = useCallback(
    (value) => {
      setNote(shiftNote(getNote(startingNote), value).name);
    },
    [setNote]
  );

  return (
    <View
      style={{
        backgroundColor,
        flex: 1,
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
      }}
    >
      <View style={{ height: topSpace }} />
      <Text
        style={{
          height: textHeight,
          alignSelf: "center",
          color: "white",
          fontSize: 22,
        }}
      >
        {note}
      </Text>
      <View
        style={{
          width: sliderHeight,
          transform: [
            {
              rotate: "90deg",
            },
            {
              translateX:
                sliderHeight / 2 -
                fretWidth / 2 +
                sliderThumbRadius / 2 +
                totalSafeArea / 2,
            },
            {
              translateY: (sliderHeight - fretWidth) / 2,
            },
          ],
        }}
      >
        <Slider
          theme={{
            disableMinTrackTintColor: "gray",
            maximumTrackTintColor: "gray",
            minimumTrackTintColor: "gray",
            cacheTrackTintColor: "#333",
            bubbleBackgroundColor: "#666",
          }}
          onValueChange={onNoteChange}
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          thumbWidth={sliderThumbRadius}
          step={15}
          snapToStep={true}
          renderBubble={() => null}
          markStyle={{
            width: fretWidth,
            height: 4,
            backgroundColor: "#fff",
            position: "absolute",
            borderRadius: 0,
            top: -2,
            transform: [
              {
                rotate: "90deg",
              },
              {
                translateY: (-1 * sliderThumbRadius) / 2 - 2,
              },
            ],
          }}
        />
      </View>
    </View>
  );
}

const instruments = {
  Bass: ["E", "A", "D", "G"],
  Guitar: ["E", "A", "D", "G", "B", "E"],
};

const instrumentIndices = ["Guitar", "Bass"];

const colors = ["pink", "blue", "green", "purple", "orange", "red"];

export default function Index() {
  const safeAreaInsets = useSafeAreaInsets();
  const [instrumentIndex, setInstrumentIndex] = useState(0);

  const myInstrument = instruments[instrumentIndices[instrumentIndex]];

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {myInstrument.map((note, index) => (
        <FretSlider
          key={note + index.toString()}
          startingNote={note}
          backgroundColor={colors[index]}
          totalNotes={myInstrument.length}
        />
      ))}
      <View
        style={{
          position: "absolute",
          top: safeAreaInsets.top,
          left: 0,
          right: 0,
          height: 40,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SegmentedControl
          values={instrumentIndices}
          selectedIndex={instrumentIndex}
          onChange={(event) => {
            setInstrumentIndex({
              selectedIndex: event.nativeEvent.selectedSegmentIndex,
            });
          }}
        />
      </View>
    </View>
  );
}
