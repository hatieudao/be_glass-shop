/**
 * override nest metadata, only apply this decorator in method
 * NOTE : this override method can only override 1-level metadata so if you have multiple
 * inheritance, this decorators only override the last inheritance
 */
export const Override = () => {
  return (target: any, __: any, property: PropertyDescriptor) => {
    /**
     * get parent class
     */
    const parentTarget = Object.getPrototypeOf(target);
    /**
     * if the desired target doesn't have any parent
     */
    if (Object.getPrototypeOf(target.constructor).name === '') {
      throw new Error(`class ${target.constructor.name} doesn't have parent`);
    }

    /**
     * get the desired property descriptor
     */
    const parentPropertyDescriptor = Object.getOwnPropertyDescriptor(
      parentTarget,
      property.value.name,
    );

    /**
     * if desired property is not included in parent class
     */
    if (!parentPropertyDescriptor) {
      throw new Error(
        `parent class ${parentTarget.constructor.name} doesn't have property ${property.value.name}`,
      );
    }

    /**
     * get all metadata keys from parent property
     */
    const metadataKeys = Reflect.getOwnMetadataKeys(
      parentPropertyDescriptor.value,
    );

    /**
     * copying all metadata from parent property to target property
     */
    metadataKeys.forEach(mkey => {
      const parentMetaData = Reflect.getMetadata(
        mkey,
        parentPropertyDescriptor.value,
      );
      Reflect.defineMetadata(mkey, parentMetaData, property.value);
    });
  };
};
