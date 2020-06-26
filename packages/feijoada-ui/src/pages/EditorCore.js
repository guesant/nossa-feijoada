import * as React from "react";
import * as bsimCore from "@bsim/core";
import { fabric } from "fabric";
import {
  GroupSeparatorVertical,
  GroupSeparatorHorizontal,
} from "../components/GroupSeparator";
import GroupContainer from "../components/GroupContainer";
import GroupContainerBorder from "../components/GroupContainerBorder";
import EDITOR_DEFAULT_TEMPLATE from "../vars/editor-default-template";
import EditorCoreDoc from "./EditorCoreDoc";
import EditorCoreInfo from "./EditorCoreInfo";
import EditorCoreSketch from "./EditorCoreSketch";

const {
  fabric: {
    getCanvas: { canvasByDOM },
  },
  lib: {
    model: {
      mutations: {
        ADD_OBJECT,
        REMOVE_OBJECT,
        UPDATE_OBJECT,
        ADD_STATIC_IMAGE,
        REMOVE_STATIC_IMAGE,
      },
    },
  },
} = bsimCore;

const _canvasByDOM = canvasByDOM({
  fabric,
  document: window.document,
});
const GET_CANVAS = () => window.EDITOR_CANVAS;
const SET_CANVAS = (canvas) => {
  window.EDITOR_CANVAS = canvas;
  return canvas;
};
const DELETE_CANVAS = () => {
  delete window.EDITOR_CANVAS;
};

export default class EditorCore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: EDITOR_DEFAULT_TEMPLATE,
    };
    this.refdiv = React.createRef();
  }
  async disposeCanvas() {
    if (GET_CANVAS()) {
      const canvas = GET_CANVAS();
      canvas.dispose();
      DELETE_CANVAS();
    }
  }
  async disposeCanvas() {
    if (GET_CANVAS()) {
      const canvas = GET_CANVAS();
      canvas.dispose();
      DELETE_CANVAS();
    }
  }
  async getCanvas() {
    return _canvasByDOM({
      wrapper: this.refdiv.current,
      id: "pgs--editr--canvas-plgrnd",
    });
  }
  async setupCanvas() {
    await this.disposeCanvas();
    const canvas = this.getCanvas({
      doc: this.state.doc,
    });
    canvas.set(this.state.doc.model.sketch);
    return SET_CANVAS(canvas);
  }
  async removeStaticImage(idx) {
    await new Promise((resolve) => {
      this.setState(REMOVE_STATIC_IMAGE({ idx }), resolve);
    });
  }
  async addStaticImage(staticImages) {
    await new Promise((resolve) => {
      this.setState(ADD_STATIC_IMAGE({ staticImages }), resolve);
    });
  }
  async addObject(fabricObject) {
    await new Promise((resolve) => {
      this.setState(ADD_OBJECT({ object: fabricObject.toObject() }), resolve);
    });
  }
  async removeObject(idx) {
    await new Promise((resolve) => {
      this.setState(REMOVE_OBJECT({ idx }), resolve);
    });
  }
  async updateObject(idx, updatedObject) {
    await new Promise((resolve) => {
      this.setState(UPDATE_OBJECT({ idx, updatedObject }), resolve);
    });
  }
  render() {
    return (
      <GroupContainer>
        <GroupContainerBorder>
          <div className="tw-flex-1">
            <div className="tw-px-2">
              <div className="tw-py-2">
                <EditorCoreDoc
                  doc={this.state.doc}
                  onSetState={async (state) =>
                    new Promise((resolve) => this.setState(state, resolve))}
                />
              </div>
              <GroupSeparatorHorizontal />
              <div className="tw-py-2">
                <div>
                  <EditorCoreSketch
                    doc={this.state.doc}
                    onSetState={async (state) => {
                      await new Promise((resolve) =>
                        this.setState(state, resolve)
                      );
                    }}
                  />
                </div>
              </div>
          </div>
          </div>
          <GroupSeparatorVertical />
          <div>
            <div ref={this.refdiv}></div>
            <EditorCoreInfo doc={this.state.doc} />
            </div>
        </GroupContainerBorder>
      </GroupContainer>
    );
  }
  }
