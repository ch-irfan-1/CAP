export const ControlFinder = (obj: any, key: any, componentKey: any = '', moduleKey: any = ''): any => {

  let module: any = {};
  let component: any = {};
  let property: any = [];

  try {
    // if ((typeof obj == "object") && (obj !== null))
    //   module = obj[moduleKey];

    // if ((typeof module == "object") && (module !== null))
    //   component = module[componentKey];

    // let children = Object.keys(obj);
    // if (children.length > 0) {
    //   for (let i = 0; i < children.length; i++) {
    //     let currModule = obj[children[i]];
    //     let children2 = Object.keys(currModule);
    //     for (let j = 0; j < children2.length; j++) {
    //       if (children2[i] == componentKey) {
    //         component = currModule[children2[i]];
    //       }
    //     }
    //   }
    // }

    if(obj != null)  {
      if ((typeof obj == "object") && (obj !== null))
        component = obj[componentKey];

      if ((typeof component == "object") && (component !== null) && component[key] != undefined)
        property.push(component[key]);
    }
    
  }
  catch (error) {
    console.error('Error Detail', error);
  }

  return property;
}

export const ComponentFinder = (obj: any, key: any, componentKey: any = ''): any => {
  let list: any = [];
  let tempComponent: any = [];
  if (!obj) return list;
  if (Object.keys(TComponent)?.length === 0) {
    if (obj instanceof Array) {
      for (var i in obj) {
        if (tempComponent.length == 0)
          list = list.concat(ControlFinder(obj[i], key, componentKey));
      }
      return list;
    }
    if (obj[key]) list.push(obj[key]);

    if ((typeof obj == "object") && (obj !== null) && Object.keys(TComponent)?.length === 0) {
      let children = Object.keys(obj);
      if (children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          if (children[i] == componentKey) {
            TComponent = obj[children[i]];
            return TComponent;
            break;
          }
          list = list.concat(ControlFinder(obj[children[i]], key, componentKey));
        }
      }
    }
  }

  return TComponent;
}

export const PropertyFinder = (obj: any, key: any): any => {
  let list: any = [];
  if (!obj) return list;
  if (list.length == 0) {
    if (obj[key]) list.push(obj[key]);

    if (list.length == 0) {
      if ((typeof obj == "object") && (obj !== null)) {
        let children = Object.keys(obj);
        if (children.length > 0) {
          for (let i = 0; i < children.length; i++) {
            if (children[i] == key)
              list = list.concat(ControlFinder(obj[children[i]], key));
          }
        }
      }
    }

  }

  return list;
}

let TComponent = {};
export { TComponent };