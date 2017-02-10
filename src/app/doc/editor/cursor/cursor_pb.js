/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.Cursor', null, global);
goog.exportSymbol('proto.Position', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Cursor = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.Cursor.oneofGroups_);
};
goog.inherits(proto.Cursor, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Cursor.displayName = 'proto.Cursor';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.Cursor.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.Cursor.ContentCase = {
  CONTENT_NOT_SET: 0,
  POSITION: 1,
  VISIBLE: 2
};

/**
 * @return {proto.Cursor.ContentCase}
 */
proto.Cursor.prototype.getContentCase = function() {
  return /** @type {proto.Cursor.ContentCase} */(jspb.Message.computeOneofCase(this, proto.Cursor.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Cursor.prototype.toObject = function(opt_includeInstance) {
  return proto.Cursor.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Cursor} msg The msg instance to transform.
 * @return {!Object}
 */
proto.Cursor.toObject = function(includeInstance, msg) {
  var f, obj = {
    position: (f = msg.getPosition()) && proto.Position.toObject(includeInstance, f),
    visible: jspb.Message.getFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Cursor}
 */
proto.Cursor.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Cursor;
  return proto.Cursor.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Cursor} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Cursor}
 */
proto.Cursor.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Position;
      reader.readMessage(value,proto.Position.deserializeBinaryFromReader);
      msg.setPosition(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setVisible(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Cursor.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Cursor.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Cursor} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.Cursor.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPosition();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.Position.serializeBinaryToWriter
    );
  }
  f = /** @type {boolean} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional Position position = 1;
 * @return {?proto.Position}
 */
proto.Cursor.prototype.getPosition = function() {
  return /** @type{?proto.Position} */ (
    jspb.Message.getWrapperField(this, proto.Position, 1));
};


/** @param {?proto.Position|undefined} value */
proto.Cursor.prototype.setPosition = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.Cursor.oneofGroups_[0], value);
};


proto.Cursor.prototype.clearPosition = function() {
  this.setPosition(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Cursor.prototype.hasPosition = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bool visible = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.Cursor.prototype.getVisible = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 2, false));
};


/** @param {boolean} value */
proto.Cursor.prototype.setVisible = function(value) {
  jspb.Message.setOneofField(this, 2, proto.Cursor.oneofGroups_[0], value);
};


proto.Cursor.prototype.clearVisible = function() {
  jspb.Message.setOneofField(this, 2, proto.Cursor.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Cursor.prototype.hasVisible = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Position = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.Position.repeatedFields_, null);
};
goog.inherits(proto.Position, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Position.displayName = 'proto.Position';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.Position.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Position.prototype.toObject = function(opt_includeInstance) {
  return proto.Position.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Position} msg The msg instance to transform.
 * @return {!Object}
 */
proto.Position.toObject = function(includeInstance, msg) {
  var f, obj = {
    baseList: jspb.Message.getRepeatedFloatingPointField(msg, 2),
    last: jspb.Message.getFieldWithDefault(msg, 3, 0),
    index: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Position}
 */
proto.Position.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Position;
  return proto.Position.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Position} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Position}
 */
proto.Position.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = /** @type {!Array.<number>} */ (reader.readPackedDouble());
      msg.setBaseList(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setLast(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setIndex(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Position.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Position.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Position} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.Position.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBaseList();
  if (f.length > 0) {
    writer.writePackedDouble(
      2,
      f
    );
  }
  f = message.getLast();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getIndex();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
};


/**
 * repeated double base = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<number>}
 */
proto.Position.prototype.getBaseList = function() {
  return /** @type {!Array.<number>} */ (jspb.Message.getRepeatedFloatingPointField(this, 2));
};


/** @param {!Array.<number>} value */
proto.Position.prototype.setBaseList = function(value) {
  jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!number} value
 * @param {number=} opt_index
 */
proto.Position.prototype.addBase = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


proto.Position.prototype.clearBaseList = function() {
  this.setBaseList([]);
};


/**
 * optional int32 last = 3;
 * @return {number}
 */
proto.Position.prototype.getLast = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.Position.prototype.setLast = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int32 index = 4;
 * @return {number}
 */
proto.Position.prototype.getIndex = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.Position.prototype.setIndex = function(value) {
  jspb.Message.setField(this, 4, value);
};


goog.object.extend(exports, proto);