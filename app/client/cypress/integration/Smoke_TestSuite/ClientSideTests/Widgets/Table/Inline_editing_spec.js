const dsl = require("../../../../../fixtures/Table/InlineEditingDSL.json");
const commonlocators = require("../../../../../locators/commonlocators.json");
const widgetsPage = require("../../../../../locators/Widgets.json");

describe("Table widget inline editing functionality", () => {
  beforeEach(() => {
    cy.addDsl(dsl);
  });

  it("should check that edit check box is present in the columns list", () => {
    cy.openPropertyPane("tablewidgetv2");

    ["step", "task", "status", "action"].forEach((column) => {
      cy.get(
        `[data-rbd-draggable-id="${column}"] .t--card-checkbox input[type="checkbox"]`,
      ).should("exist");
    });
  });

  it("should check that editablity checkbox is preset top of the list", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.get(`.t--property-control-columns .t--uber-editable-checkbox`).should(
      "exist",
    );
  });

  it("should check that turning on editablity turns on edit in all the editable column in the list", () => {
    cy.openPropertyPane("tablewidgetv2");
    function checkEditableCheckbox(expected) {
      ["step", "task", "status"].forEach((column) => {
        cy.get(
          `[data-rbd-draggable-id="${column}"] .t--card-checkbox.t--checked`,
        ).should(expected);
      });
    }

    checkEditableCheckbox("not.exist");

    cy.get(
      `.t--property-control-columns .t--uber-editable-checkbox input+span`,
    ).click();

    checkEditableCheckbox("exist");

    cy.get(
      `.t--property-control-columns .t--uber-editable-checkbox input+span`,
    ).click();

    checkEditableCheckbox("not.exist");
  });

  it("should check that turning on editablity DOESN'T turn on edit in the non editable column in the list", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.get(
      '[data-rbd-draggable-id="action"] .t--card-checkbox.t--checked',
    ).should("not.exist");
    cy.get(
      `.t--property-control-columns .t--uber-editable-checkbox input+span`,
    ).click();
    cy.get(
      '[data-rbd-draggable-id="action"] .t--card-checkbox.t--checked',
    ).should("not.exist");
    cy.get(
      `.t--property-control-columns .t--uber-editable-checkbox input+span`,
    ).click();
    cy.get(
      '[data-rbd-draggable-id="action"] .t--card-checkbox.t--checked',
    ).should("not.exist");
  });

  it("should check that checkbox in the column list and checkbox inside the column settings ARE in sync", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.get(
      '[data-rbd-draggable-id="step"] .t--card-checkbox.t--checked',
    ).should("not.exist");
    cy.editColumn("step");
    cy.get(".t--property-control-editable .bp3-switch.checked").should(
      "not.exist",
    );
    cy.get(".t--property-pane-back-btn").click();
    cy.get(
      '[data-rbd-draggable-id="step"] .t--card-checkbox input+span',
    ).click();
    cy.get(
      '[data-rbd-draggable-id="step"] .t--card-checkbox.t--checked',
    ).should("exist");
    cy.editColumn("step");
    cy.get(".t--property-control-editable .bp3-switch.checked").should("exist");
    cy.get(".t--property-pane-back-btn").click();
    cy.get(
      '[data-rbd-draggable-id="step"] .t--card-checkbox input+span',
    ).click();
    cy.get(
      '[data-rbd-draggable-id="step"] .t--card-checkbox.t--checked',
    ).should("not.exist");
    cy.editColumn("step");
    cy.get(".t--property-control-editable .bp3-switch.checked").should(
      "not.exist",
    );
  });

  it("should check that checkbox in the column list and checkbox inside the column settings ARE NOT in sync when there is js expression", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.editColumn("step");
    cy.get(".t--property-control-editable .t--js-toggle").click();
    cy.updateCodeInput(".t--property-control-editable", `{{true === true}}`);
    cy.get(".t--property-pane-back-btn").click();
    cy.makeColumnEditable("step");
    cy.editColumn("step");
    cy.get(".t--property-control-editable .CodeMirror .CodeMirror-code").should(
      "contain",
      "{{true === true}}",
    );
    cy.get(".t--property-pane-back-btn").click();
    cy.makeColumnEditable("step");
    cy.editColumn("step");
    cy.get(".t--property-control-editable .CodeMirror .CodeMirror-code").should(
      "contain",
      "{{true === true}}",
    );
  });

  it("should check that editable checkbox is disabled for columns that are not editable", () => {
    cy.openPropertyPane("tablewidgetv2");
    [
      {
        columnType: "URL",
        expected: "be.disabled",
      },
      {
        columnType: "Number",
        expected: "not.be.disabled",
      },
      {
        columnType: "Date",
        expected: "be.disabled",
      },
      {
        columnType: "Image",
        expected: "be.disabled",
      },
      {
        columnType: "Video",
        expected: "be.disabled",
      },
      {
        columnType: "Button",
        expected: "be.disabled",
      },
      {
        columnType: "Menu Button",
        expected: "be.disabled",
      },
      {
        columnType: "Icon Button",
        expected: "be.disabled",
      },
      {
        columnType: "Plain Text",
        expected: "not.be.disabled",
      },
    ].forEach((data) => {
      cy.editColumn("step");
      cy.get(commonlocators.changeColType)
        .last()
        .click();
      cy.get(".t--dropdown-option")
        .children()
        .contains(data.columnType)
        .click();
      cy.wait("@updateLayout");
      cy.get(".t--property-pane-back-btn").click();
      cy.get(`[data-rbd-draggable-id="step"] .t--card-checkbox input`).should(
        data.expected,
      );
    });
  });

  it("should check that editable property is only available for Plain text & number columns", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.editColumn("step");
    [
      {
        columnType: "URL",
        expected: "not.exist",
      },
      {
        columnType: "Number",
        expected: "exist",
      },
      {
        columnType: "Date",
        expected: "not.exist",
      },
      {
        columnType: "Image",
        expected: "not.exist",
      },
      {
        columnType: "Video",
        expected: "not.exist",
      },
      {
        columnType: "Button",
        expected: "not.exist",
      },
      {
        columnType: "Menu Button",
        expected: "not.exist",
      },
      {
        columnType: "Icon Button",
        expected: "not.exist",
      },
      {
        columnType: "Plain Text",
        expected: "exist",
      },
    ].forEach((data) => {
      cy.get(commonlocators.changeColType)
        .last()
        .click();
      cy.get(".t--dropdown-option")
        .children()
        .contains(data.columnType)
        .click();
      cy.wait("@updateLayout");
      cy.get(".t--property-control-editable").should(data.expected);
    });
  });

  // it.only("should check that turning on editablilty for a column shows a edit icon when hovered on any cell of the corresponding column", () => {
  //   cy.openPropertyPane("tablewidgetv2");
  //   cy.get('[data-rbd-draggable-id="step"] .t--card-checkbox input+span').click();
  //   cy.wait(1000);
  //   cy.hoverTableCell(0, 0);
  //   cy.get("[data-colindex=0][data-rowindex=0] .t--editable-cell-icon").should("have.css", "display", "block");
  //   cy.wait(30000);
  // });

  it("should check that cell of an editable column is editable", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    // click the edit icon
    cy.editTableCell(0, 0);
    cy.get(
      "[data-colindex=0][data-rowindex=0] .t--inlined-cell-editor input.bp3-input",
    ).should("not.be.disabled");

    //double click the cell
    cy.openPropertyPane("tablewidgetv2");
    cy.get(
      `[data-colindex=0][data-rowindex=0] .t--inlined-cell-editor input.bp3-input`,
    ).should("not.exist");
    cy.get(`[data-colindex=0][data-rowindex=0] .t--table-text-cell`).trigger(
      "dblclick",
    );
    cy.get(
      `[data-colindex=0][data-rowindex=0] .t--inlined-cell-editor input.bp3-input`,
    ).should("exist");
    cy.get(
      "[data-colindex=0][data-rowindex=0] .t--inlined-cell-editor input.bp3-input",
    ).should("not.be.disabled");
  });

  it("should check that changes can be discarded by clicking escape", () => {
    cy.openPropertyPane("tablewidgetv2");
    let value;
    cy.readTableV2data(0, 0).then((val) => {
      value = val;
    });
    cy.makeColumnEditable("step");
    cy.editTableCell(0, 0);
    cy.enterTableCellValue(0, 0, "newValue");
    cy.discardTableCellValue(0, 0);
    cy.get(
      `[data-colindex="0"][data-rowindex="0"] .t--inlined-cell-editor input.bp3-input`,
    ).should("not.exist");
    cy.readTableV2data(0, 0).then((val) => {
      expect(val).to.equal(value);
    });
  });

  it("should check that changes can be saved by pressing enter or clicking outside", () => {
    cy.openPropertyPane("tablewidgetv2");
    let value;
    cy.readTableV2data(0, 0).then((val) => {
      value = val;
    });
    cy.makeColumnEditable("step");
    cy.editTableCell(0, 0);
    cy.enterTableCellValue(0, 0, "newValue");
    cy.saveTableCellValue(0, 0);
    cy.get(
      `[data-colindex="0"][data-rowindex="0"] .t--inlined-cell-editor input.bp3-input`,
    ).should("not.exist");
    cy.wait(1000);
    cy.readTableV2data(0, 0).then((val) => {
      expect(val).to.not.equal(value);
      value = val;
    });
    cy.editTableCell(0, 0);
    cy.enterTableCellValue(0, 0, "someOtherNewValue");
    cy.openPropertyPane("tablewidgetv2");
    cy.get(
      `[data-colindex="0"][data-rowindex="0"] .t--inlined-cell-editor input.bp3-input`,
    ).should("not.exist");
    cy.wait(1000);
    cy.readTableV2data(0, 0).then((val) => {
      expect(val).to.not.equal(value);
    });
  });

  it("should check that updatedRows and updatedRowIndices have correct values", () => {
    cy.dragAndDropToCanvas("textwidget", { x: 300, y: 500 });
    cy.openPropertyPane("textwidget");
    cy.updateCodeInput(".t--property-control-text", `{{Table1.updatedRows}}`);
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editTableCell(0, 0);
    cy.enterTableCellValue(0, 0, "newValue");
    cy.saveTableCellValue(0, 0);
    cy.get(".t--widget-textwidget .bp3-ui-text").should(
      "contain",
      `[  {    "index": 0,    "updatedFields": {      "step": "newValue"    },    "allFields": {      "step": "newValue",      "task": "Drop a table",      "status": "✅",      "action": "",      "EditActions1": ""    }  }]`,
    );
    cy.openPropertyPane("textwidget");
    cy.updateCodeInput(
      ".t--property-control-text",
      `{{Table1.updatedRowIndices}}`,
    );
    cy.get(".t--widget-textwidget .bp3-ui-text").should("contain", "[  0]");
  });

  it("should check that onsubmit event is available for the columns that are editable", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.editColumn("step");
    [
      {
        columnType: "URL",
        expected: "not.exist",
      },
      {
        columnType: "Number",
        expected: "not.exist",
      },
      {
        columnType: "Date",
        expected: "not.exist",
      },
      {
        columnType: "Image",
        expected: "not.exist",
      },
      {
        columnType: "Video",
        expected: "not.exist",
      },
      {
        columnType: "Button",
        expected: "not.exist",
      },
      {
        columnType: "Menu Button",
        expected: "not.exist",
      },
      {
        columnType: "Icon Button",
        expected: "not.exist",
      },
      {
        columnType: "Plain Text",
        expected: "not.exist",
      },
    ].forEach((data) => {
      cy.get(commonlocators.changeColType)
        .last()
        .click();
      cy.get(".t--dropdown-option")
        .children()
        .contains(data.columnType)
        .click();
      cy.wait("@updateLayout");
      cy.get(".t--property-control-onsubmit").should(data.expected);
    });

    cy.get(".t--property-pane-back-btn").click();
    cy.makeColumnEditable("step");
    cy.editColumn("step");

    [
      {
        columnType: "URL",
        expected: "not.exist",
      },
      {
        columnType: "Number",
        expected: "exist",
      },
      {
        columnType: "Date",
        expected: "not.exist",
      },
      {
        columnType: "Image",
        expected: "not.exist",
      },
      {
        columnType: "Video",
        expected: "not.exist",
      },
      {
        columnType: "Button",
        expected: "not.exist",
      },
      {
        columnType: "Menu Button",
        expected: "not.exist",
      },
      {
        columnType: "Icon Button",
        expected: "not.exist",
      },
      {
        columnType: "Plain Text",
        expected: "exist",
      },
    ].forEach((data) => {
      cy.get(commonlocators.changeColType)
        .last()
        .click();
      cy.get(".t--dropdown-option")
        .children()
        .contains(data.columnType)
        .click();
      cy.wait("@updateLayout");
      cy.get(".t--property-control-onsubmit").should(data.expected);
    });
  });

  it("should check that onsubmit event is triggered when changes are saved", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editColumn("step");
    cy.get(
      ".t--property-control-onsubmit .t--open-dropdown-Select-Action",
    ).click();
    cy.selectShowMsg();
    cy.addSuccessMessage("Submitted!!", ".t--property-control-onsubmit");

    cy.editTableCell(0, 0);
    cy.enterTableCellValue(0, 0, "NewValue");
    cy.saveTableCellValue(0, 0);

    cy.get(widgetsPage.toastAction).should("be.visible");
    cy.get(widgetsPage.toastActionText)
      .last()
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Submitted!!");
      });
  });

  it("should check that onSubmit events has access to edit values through triggeredRow", () => {
    const value = "newCellValue";
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editColumn("step");
    cy.get(
      ".t--property-control-onsubmit .t--open-dropdown-Select-Action",
    ).click();
    cy.selectShowMsg();
    cy.addSuccessMessage(
      "{{Table1.triggeredRow.step}}",
      ".t--property-control-onsubmit",
    );

    cy.editTableCell(0, 0);
    cy.enterTableCellValue(0, 0, value);
    cy.saveTableCellValue(0, 0);

    cy.get(widgetsPage.toastAction).should("be.visible");
    cy.get(widgetsPage.toastActionText)
      .last()
      .invoke("text")
      .then((text) => {
        expect(text).to.equal(value);
      });
  });

  it("should check that onSave is working", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editColumn("EditActions1");
    cy.get(".t--property-pane-section-collapse-savebutton").click();
    cy.get(".t--property-pane-section-collapse-discardbutton").click();
    cy.get(".t--property-control-onsave .t--open-dropdown-Select-Action")
      .last()
      .click();
    cy.selectShowMsg();
    cy.addSuccessMessage("Saved!!", ".t--property-control-onsave");
    cy.editTableCell(0, 0);
    cy.enterTableCellValue(0, 0, "NewValue");
    cy.openPropertyPane("tablewidgetv2");
    cy.saveTableRow(4, 0);
    cy.get(widgetsPage.toastAction).should("be.visible");
    cy.get(widgetsPage.toastActionText)
      .last()
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("Saved!!");
      });
  });

  it("should check that onSave events has access to edit values through triggeredRow", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editColumn("EditActions1");
    cy.get(".t--property-pane-section-collapse-savebutton").click();
    cy.get(".t--property-pane-section-collapse-discardbutton").click();
    cy.get(".t--property-control-onsave .t--open-dropdown-Select-Action")
      .last()
      .click();
    cy.selectShowMsg();
    cy.addSuccessMessage(
      "{{Table1.triggeredRow.step}}",
      ".t--property-control-onsave",
    );
    cy.editTableCell(0, 0);
    cy.enterTableCellValue(0, 0, "NewValue");
    cy.openPropertyPane("tablewidgetv2");
    cy.saveTableRow(4, 0);
    cy.get(widgetsPage.toastAction).should("be.visible");
    cy.get(widgetsPage.toastActionText)
      .last()
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("NewValue");
      });
  });

  it("should check that onDiscard event is working", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editColumn("EditActions1");
    cy.get(".t--property-pane-section-collapse-savebutton").click();
    cy.get(".t--property-pane-section-collapse-discardbutton").click();
    cy.get(".t--property-control-ondiscard .t--open-dropdown-Select-Action")
      .last()
      .click();
    cy.selectShowMsg();
    cy.addSuccessMessage("discarded!!", ".t--property-control-ondiscard");
    cy.editTableCell(0, 0);
    cy.enterTableCellValue(0, 0, "NewValue");
    cy.openPropertyPane("tablewidgetv2");
    cy.discardTableRow(4, 0);
    cy.get(widgetsPage.toastAction).should("be.visible");
    cy.get(widgetsPage.toastActionText)
      .last()
      .invoke("text")
      .then((text) => {
        expect(text).to.equal("discarded!!");
      });
  });
});

describe("Table widget inline editing functionality with Text wrapping functionality", () => {
  beforeEach(() => {
    cy.addDsl(dsl);
  });

  it("should check that inline editing works with text wrapping disabled", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editTableCell(0, 0);
    cy.get(
      "[data-colindex=0][data-rowindex=0] .t--inlined-cell-editor input.bp3-input",
    ).should("not.be.disabled");
  });

  it("should check that inline editing works with text wrapping enabled", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editColumn("step");
    cy.get(".t--property-control-cellwrapping .bp3-control-indicator")
      .first()
      .click();
    cy.editTableCell(0, 0);
    cy.get(
      "[data-colindex=0][data-rowindex=0] .t--inlined-cell-editor input.bp3-input",
    ).should("not.be.disabled");
  });

  it("should check that doesn't grow taller when text wrapping is disabled", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editTableCell(0, 0);
    cy.get(
      "[data-colindex='0'][data-rowindex='0'] .t--inlined-cell-editor",
    ).should("have.css", "height", "40px");
    cy.enterTableCellValue(0, 0, "this is a very long cell value");
    cy.get(
      "[data-colindex='0'][data-rowindex='0'] .t--inlined-cell-editor",
    ).should("have.css", "height", "40px");
  });

  it("should check that grows taller when text wrapping is enabled", () => {
    cy.openPropertyPane("tablewidgetv2");
    cy.makeColumnEditable("step");
    cy.editColumn("step");
    cy.get(".t--property-control-cellwrapping .bp3-control-indicator")
      .first()
      .click();
    cy.editTableCell(0, 0);
    cy.get(
      "[data-colindex='0'][data-rowindex='0'] .t--inlined-cell-editor",
    ).should("have.css", "height", "42px");
    cy.enterTableCellValue(0, 0, "this is a very long cell value");
    cy.get(
      "[data-colindex='0'][data-rowindex='0'] .t--inlined-cell-editor",
    ).should("not.have.css", "height", "42px");
  });
});
