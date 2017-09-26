var chart

sap.ui.define(['app/todo/controller/BaseController'], function(BaseController) {
  return BaseController.extend('app.todo.controller.Main', {
    /* ----------------------------------------------------------- *
     * lifecycle methods
     * ----------------------------------------------------------- */

    /**
     * Called when the controller is instantiated.
     * @public
     */
    onInit(oEvent) {
      // init view state (accassible via {view>/Main/...})
      this.initViewState({
        selectedFilter: 'all',
        newTodoItemName: '',
        itemsLeft: 0
      })

      // listen to relevant routes pointing to our view
      this.getRouter().getRoute('root').attachMatched(this.onRouteMatched, this)
      this.getRouter().getRoute('todo').attachMatched(this.onRouteMatched, this)
    },

    onAfterRendering(oEvent) {
      // C3 Stuff
      chart = c3.generate({
        bindto: '#__xmlview1--c3chart',
        data: {
          columns: [['active', 0], ['done', 0]],
          types: {
            active: 'area-spline',
            done: 'area-spline'
          }
          // groups: [['active', 'done']]
        }
      })
    },

    /* ----------------------------------------------------------- *
     * event handlers
     * ----------------------------------------------------------- */

    /**
     * Called when registeres route was matched.
     */
    onRouteMatched() {
      // update items left
      this._updateItemsLeft()
    },

    /**
     * Add item to todo list.
     * @param {sap.ui.base.Event} [oEvent] An Event object consisting of an id, a source and a map of parameters.
     */
    onAddNewItem(oEvent) {
      const sNewTodoItemName = oEvent.getParameter('value')
      const oViewModel = this.getViewModel()
      const oTodoModel = this.getView().getModel('todo')
      const aTodoItems = oTodoModel.getProperty('/items')

      // add new item to todo list
      const aNewTodoItems = aTodoItems.concat({
        name: sNewTodoItemName,
        isCompleted: false
      })

      // update todo model
      oTodoModel.setProperty('/items', aNewTodoItems)

      this.updateCountHistory()

      // update todo input
      oViewModel.setProperty('/Main/newTodoItemName', '')
    },

    /**
     * Remove item from todo list.
     * @param {sap.ui.base.Event} [oEvent] An Event object consisting of an id, a source and a map of parameters.
     */
    onDeleteTodo(oEvent) {
      const oListItem = oEvent.getParameter('listItem')
      const sBindingPath = oListItem.getBindingContext('todo').getPath()
      const iDeleteIndex = parseInt(sBindingPath.split('/').pop(), 10)
      const oTodoModel = this.getView().getModel('todo')
      const aTodoItems = oTodoModel.getProperty('/items')

      // remove deleted item from todo list
      const aNewTodoItems = aTodoItems.filter(
        (oItem, iIndex) => iIndex !== iDeleteIndex
      )

      // update todo model
      oTodoModel.setProperty('/items', aNewTodoItems)

      this.updateCountHistory()

      // update items left
      this._updateItemsLeft()
    },

    /**
     * Delete all completed todo items.
     */
    onClearCompletedTodos() {
      const oTodoModel = this.getView().getModel('todo')
      const aTodoItems = oTodoModel.getProperty('/items')

      // remove deleted item from todo list
      const aNewTodoItems = aTodoItems.filter(
        oItem => oItem.isCompleted === false
      )

      // update todo model
      oTodoModel.setProperty('/items', aNewTodoItems)

      this.updateCountHistory()
    },

    /**
     * Toggle completion stat of todo list.
     * @param {sap.ui.base.Event} [oEvent] An Event object consisting of an id, a source and a map of parameters.
     */
    onTogglTodoListCompletion(oEvent) {
      const oCheckBox = oEvent.getSource()
      const isCompleted = oEvent.getParameter('selected')
      const sBindingPath = oCheckBox.getBindingContext('todo').getPath()
      const iDeleteIndex = parseInt(sBindingPath.split('/').pop(), 10)
      const oTodoModel = this.getView().getModel('todo')
      const aTodoItems = oTodoModel.getProperty('/items')

      // update item from todo list
      const aNewTodoItems = aTodoItems.map(
        (oItem, iIndex) =>
          iIndex === iDeleteIndex
            ? { ...oItem, isCompleted: isCompleted }
            : oItem
      )

      // update todo model
      oTodoModel.setProperty('/items', aNewTodoItems)

      this.updateCountHistory()

      // update items left
      this._updateItemsLeft()
    },

    /**
     * Complete all todo items.
     * @param {sap.ui.base.Event} [oEvent] An Event object consisting of an id, a source and a map of parameters.
     */
    onPressCompleteAllTodos(oEvent) {
      const oToggleButton = oEvent.getSource()
      const isCompleteAll = oToggleButton.getPressed()
      const oTodoModel = this.getView().getModel('todo')
      const aTodoItems = oTodoModel.getProperty('/items')

      // update item from todo list
      const aNewTodoItems = aTodoItems.map(oItem => ({
        ...oItem,
        isCompleted: isCompleteAll
      }))

      // update todo model
      oTodoModel.setProperty('/items', aNewTodoItems)

      this.updateCountHistory()

      // update items left
      this._updateItemsLeft()
    },

    updateCountHistory() {
      const oTodoModel = this.getView().getModel('todo')
      const aTodoItems = oTodoModel.getProperty('/items')

      const oTodoCountHistoryModel = this.getView().getModel('countHistory')
      const aCountHistoryActive = oTodoCountHistoryModel.getProperty(
        '/countHistoryActive'
      )
      const aCountHistoryDone = oTodoCountHistoryModel.getProperty(
        '/countHistoryDone'
      )

      let iNewCountActive = 0
      let iNewCountDone = 0

      aTodoItems.forEach(function(todoItem) {
        if (todoItem.isCompleted) {
          iNewCountDone++
        } else {
          iNewCountActive++
        }
      }, this)

      const aNewCountHistoryActive = aCountHistoryActive.slice()
      aNewCountHistoryActive.push(iNewCountActive)

      const aNewCountHistoryDone = aCountHistoryDone.slice()
      aNewCountHistoryDone.push(iNewCountDone)

      // update model
      oTodoCountHistoryModel.setProperty('/currentCountActive', iNewCountActive)
      oTodoCountHistoryModel.setProperty(
        '/countHistoryActive',
        aNewCountHistoryActive
      )
      oTodoCountHistoryModel.setProperty('/currentCountDone', iNewCountDone)
      oTodoCountHistoryModel.setProperty(
        '/countHistoryDone',
        aNewCountHistoryDone
      )

      this.updateChart(aNewCountHistoryActive, aNewCountHistoryDone)
    },

    updateChart(activeArray, doneArray) {
      const activeArrayName = ['active']
      const doneArrayName = ['done']

      const loadDataActive = activeArrayName.concat(activeArray)
      const loadDataDone = doneArrayName.concat(doneArray)

      chart.load({
        columns: [loadDataActive, loadDataDone]
      })
    },

    /* ----------------------------------------------------------- *
     * private methods
     * ----------------------------------------------------------- */

    /**
      * Update number of not completed items.
      * @private
      */
    _updateItemsLeft() {
      const oViewModel = this.getViewModel()
      const oTodoModel = this.getView().getModel('todo')
      const aTodoItems = oTodoModel.getProperty('/items')

      // calculate how many items are left
      const aTodoItemsLeft = aTodoItems.filter(oItem => !oItem.isCompleted)

      // update view model
      oViewModel.setProperty('/Main/itemsLeft', aTodoItemsLeft.length)
    }
  })
})
