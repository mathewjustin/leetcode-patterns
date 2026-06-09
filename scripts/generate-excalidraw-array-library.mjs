import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const outputPath = resolve(
  "excalidraw/libraries/algorithm-arrays.excalidrawlib",
);

let sequence = 0;

function nextId(prefix) {
  sequence += 1;
  return `${prefix}-${sequence}`;
}

function baseElement(type, x, y, width, height, groupId) {
  return {
    id: nextId(type),
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: type === "rectangle" ? "#e7f5ff" : "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [groupId],
    seed: 1000 + sequence,
    version: 1,
    versionNonce: 2000 + sequence,
    isDeleted: false,
    boundElementIds: null,
  };
}

function textElement(text, x, y, width, fontSize, groupId, color = "#1e1e1e") {
  const height = Math.ceil(fontSize * 1.25);

  return {
    ...baseElement("text", x, y, width, height, groupId),
    strokeColor: color,
    strokeWidth: 1,
    text,
    fontSize,
    fontFamily: 1,
    textAlign: "center",
    verticalAlign: "middle",
    baseline: Math.round(fontSize * 0.9),
  };
}

function rectangleElement(x, y, width, height, groupId, backgroundColor) {
  return {
    ...baseElement("rectangle", x, y, width, height, groupId),
    backgroundColor,
  };
}

function arrowElement(x, y, width, height, groupId, color) {
  return {
    ...baseElement("arrow", x, y, width, height, groupId),
    strokeColor: color,
    backgroundColor: "transparent",
    points: [
      [0, 0],
      [width, height],
    ],
    lastCommittedPoint: null,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: "arrow",
  };
}

function arrayItem({
  label,
  values,
  indexed = false,
  pointers = [],
  cellWidth = 80,
}) {
  const groupId = nextId("array-group");
  const cellHeight = 58;
  const startX = 0;
  const startY = pointers.length > 0 ? 70 : 38;
  const elements = [
    textElement(label, startX, 0, values.length * cellWidth, 22, groupId),
  ];

  values.forEach((value, index) => {
    const x = startX + index * cellWidth;
    elements.push(
      rectangleElement(x, startY, cellWidth, cellHeight, groupId, "#e7f5ff"),
    );

    if (String(value)) {
      elements.push(
        textElement(String(value), x, startY + 17, cellWidth, 20, groupId),
      );
    }

    if (indexed) {
      elements.push(
        textElement(
          String(index),
          x,
          startY + cellHeight + 8,
          cellWidth,
          16,
          groupId,
          "#868e96",
        ),
      );
    }
  });

  pointers.forEach(({ name, index, color }) => {
    const centerX = startX + index * cellWidth + cellWidth / 2;
    elements.push(
      textElement(name, centerX - 35, 5, 70, 18, groupId, color),
      arrowElement(centerX, 30, 0, startY - 38, groupId, color),
    );
  });

  return elements;
}

const library = {
  type: "excalidrawlib",
  version: 1,
  source: "http://localhost:8080",
  library: [
    arrayItem({
      label: "Empty array",
      values: ["", "", "", "", "", "", "", ""],
      indexed: true,
    }),
    arrayItem({
      label: "Integer array",
      values: [3, -1, 4, 1, 5, 9],
      indexed: true,
    }),
    arrayItem({
      label: "String array",
      values: ['"cat"', '"dog"', '"fox"', '"owl"'],
      indexed: true,
      cellWidth: 100,
    }),
    arrayItem({
      label: "Two pointers",
      values: [2, 7, 11, 15, 20],
      indexed: true,
      pointers: [
        { name: "left", index: 0, color: "#1971c2" },
        { name: "right", index: 4, color: "#e03131" },
      ],
    }),
  ],
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(library, null, 2)}\n`);
console.log(`Generated ${outputPath}`);
