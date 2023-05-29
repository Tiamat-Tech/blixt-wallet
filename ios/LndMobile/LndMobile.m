#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(LndMobile, RCTEventEmitter)

RCT_EXTERN_METHOD(
  initialize: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  checkStatus: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  startLnd: (BOOL)torEnabled
  args: (NSString *)args
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  stopLnd: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  initWallet: (NSArray *)seed
  password: (NSString *)password
  recoveryWindow: (NSInteger)recoveryWindow
  channelsBackupBase64: (NSString *)channelsBackupBase64
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  unlockWallet: (NSString *)password
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  sendCommand: (NSString *)method
  payload: (NSString *)payload
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  sendStreamCommand: (NSString *)method
  payload: (NSString *)payload
  streamOnlyOnce: (BOOL)streamOnlyOnce
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  sendBiStreamCommand: (NSString *)method
  streamOnlyOnce: (BOOL)streamOnlyOnce
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  writeToStream: (NSString *)method
  payload: (NSString *)payload
  resolver: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

@end
