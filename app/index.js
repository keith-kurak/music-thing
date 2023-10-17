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

function FretSlider({ startingNote, backgroundColor, totalNotes, frets }) {
  const screenFrame = useSafeAreaFrame();
  const safeAreaInsets = useSafeAreaInsets();

  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(frets);

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
              translateX: (sliderHeight + sliderThumbRadius) / 2,
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
          step={frets}
          snapToStep={true}
          renderBubble={() => null}
          markStyle={{
            width: fretWidth,
            height: 4,
            backgroundColor: "#fff",
            position: "absolute",
            borderRadius: 0,
            transform: [
              {
                rotate: "90deg",
              },
              {
                translateY: (fretWidth - 4) / 2,
              },
            ],
          }}
        />
      </View>
    </View>
  );
}

const instruments = {
  Bass: { notes: ["E", "A", "D", "G"], frets: 21 },
  Guitar: { notes: ["E", "A", "D", "G", "B", "E"], frets: 20 },
  Ukulele: { notes: ["G", "C", "E", "A"], frets: 12 },
};

const instrumentIndices = ["Guitar", "Bass", "Ukulele"];

const colors = ["pink", "blue", "green", "purple", "orange", "red"];

export default function Index() {
  const safeAreaInsets = useSafeAreaInsets();
  const [instrumentIndex, setInstrumentIndex] = useState(0);

  const myInstrument = instruments[instrumentIndices[instrumentIndex]];

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {myInstrument.notes.map((note, index) => (
        <FretSlider
          key={note + index.toString() + instrumentIndex.toString()}
          startingNote={note}
          backgroundColor={colors[index + (instrumentIndex === 2 ? 2 : 0 /* ukulele hack */)]}
          totalNotes={myInstrument.notes.length}
          frets={myInstrument.frets}
        />
      ))}
      <View
        style={{
          position: "absolute",
          top: safeAreaInsets.top,
          left: 20,
          right: 20,
          height: 50,
        }}
      >
        <SegmentedControl
          values={instrumentIndices}
          selectedIndex={instrumentIndex}
          onChange={(event) => {
            setInstrumentIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
    </View>
  );
}
