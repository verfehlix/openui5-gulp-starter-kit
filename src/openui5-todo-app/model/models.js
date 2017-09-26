/* @flow */

sap.ui.define(['sap/ui/model/json/JSONModel', 'sap/ui/Device'], function(
  JSONModel,
  Device
) {
  return {
    createDeviceModel() {
      var oModel = new JSONModel(Device)
      oModel.setDefaultBindingMode('OneWay')
      return oModel
    },

    createTodoModel() {
      var oModel = new JSONModel({
        items: []
      })
      oModel.setDefaultBindingMode('OneWay')
      return oModel
    },

    createTodoCountHistoryModel() {
      var oModel = new JSONModel({
        currentCountActive: 0,
        countHistoryActive: [0],
        currentCountDone: 0,
        countHistoryDone: [0]
      })
      oModel.setDefaultBindingMode('OneWay')
      return oModel
    }
  }
})
