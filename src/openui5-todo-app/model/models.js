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
    }
  }
})
