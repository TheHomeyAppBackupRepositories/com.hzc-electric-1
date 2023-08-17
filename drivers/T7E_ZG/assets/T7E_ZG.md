# T5-ZG 对接说明

* Device Id: 0x0301(Thermostat)
* Device Type: Route


## Suport Cluster

| Cluster Name   |  Cluster Id  | Client/Server |
| :------------: | :----------: | :------------:|
| Basic |  0x0000  | Server |
| Identify | 0x0003 | Server |
| Groups | 0x0004 | Server |
| Scenes | 0x0005 | Server |
| On/off | 0x0006 | Server |
| Time   | 0x000A | Client |
| Over the Air Bootloading | 0x0019 | Client |
| Thermostat | 0x0201 | Server |
| Thermostat User Interface Configuration | 0x0204 | Server |
| Electrical Measurement | 0x0B04 | Server |
| Simple Metering | 0x0702 | Server |


## Cluster Support Attribute

### Basic
| Attribute Id | Attribute Name | Attribute Default Value |
| :---------:  | :------------: | :---------------------: |
| 0x0000       | Zcl Version    |      0x08 |
| 0x0001       | Application Version | 0x00 |
| 0x0002       | Stack Version  |      0x00 |
| 0x0003       | Hardwark Version|     0x00 |
| 0x0004       | Manufacturer Name |  HZC|
| 0x0005       | Model Identifier |  T7E_ZG |
| 0x0006       | Date Code       |   20220818|
| 0x0007       | Power Source    |   0x01   |
| 0x4000       | Sw Build Id     |   1.00   |
| 0xFFFD       | Cluster Revision|   3      |
| 0xFFFE       | Report Status   |    NULL  |



### Identify

| Attribute Id | Attribute Name | Attribute Default Value |
| :---------:  | :------------: | :---------------------: |
| 0x0000       | Identify       |      0x00 |
| 0xFFFD       | Cluster Revision|   2      |

### On/off 
| Attribute Id | Attribute Name | Attribute Default Value |
| :---------:  | :------------: | :---------------------: |
| 0x0000       | On/off         |    1 |
| 0xFFFD       | Cluster Revision|   2 |

### Time 
| Attribute Id | Attribute Name | Attribute Default Value |
| :---------:  | :------------: | :---------------------: |
| 0xFFFD       | Cluster Revision|   2 |


### Over the Air Bootloading
| Attribute Id | Attribute Name | Attribute Default Value |
| :---------:  | :------------: | :---------------------: |
| 0x0000       | OTA Upgrade Server ID|   0xffffffffffffffff |
| 0x0001       | Offset into the file |   0xffffffff |
| 0x0006       | OTA Upgrade Status |   0x00 |
| 0xFFFD       | Cluster Revision|   4 |

### Thermostat 
| Attribute Id | Attribute Name | Attribute Default Value |
| :---------:  | :------------: | :---------------------: |
| 0x0000 | local temperature | 0x8000|
| 0x0003 | abs min heat setpoint limit | 0x01F4|
| 0x0004 | abs max heat setpoint limit | 0x0FA0|      setpoint min
| 0x0005 | abs min cool setpoint limit | 0x01F4|
| 0x0006 | abs max cool setpoint limit | 0x0FA0|      setpoint max
| 0x0008 | pi heating demand(调节器模式加热百分比) |       0x00 |
| 0x0010 | local temperature calibration | 0x00 |
| 0x0011 | occupied cooling setpoint | 0x0A28 |
| 0x0012 | occupied heating setpoint | 0x07D0 |
| 0x0019 | min setpoint dead band    | 0x0019 |
| 0x001B | control sequence of operation | 0x04|
| 0x001C | system mode (0x00: off 0x03: Cool 0x04: Heat) | 0x01 |
| 0x001E | thermostat running mode(0x00: off 0x03: Cool 0x04: Heat 0x10: Idle)| 0x04 |
| 0x0025 | thermostat programming operation mode （ eco mode ） |  0x0000 |
| 0x8000 | Window Check | 0x01|
| 0x8001 | Frost | 0x00 | boolean
| 0x8002 | Window State | 0x00 |
| 0x8003 | Work Days    | 0x00 |
| 0x8004 | Sensor Mode  | 0x00 |
| 0x8005 | Backlight    | 0x0A |
| 0x8006 | Fault        | 0x00 |
| 0x8007 | Regulator    | 0x00 |
| 0x8008 | Dry Mode Count Down | 0x00 |
| 0x8009 | Backlight Switch | 0x01 |
| 0x800A | 上报时间请求属性(bool) homey 向属性0x800B, 写入时间戳 | 0x00
| 0x800B | 写入时间戳 | 0x0000 
| 0xFFFD       | Cluster Revision|   4 |

#### Thermostat Command 
1. 设备上报周程序

| Out          | Command Name   | Command Id              |
| :---------:  | :------------: | :---------------------: |
| Server -> Client | Current Week Program Schedule (周程序上报) | 0x02 |
| Client -> Server | Get Week Program Schedule     (获取周程序) | 0x05 |
| Client -> Server | Set Week Program Schedule     (设置周程序) | 0x06 |

### Thermostat User Interface Configuration
| Attribute Id | Attribute Name | Attribute Default Value |
| :---------:  | :------------: | :---------------------: |
| 0x0000  | temperature display mode | 0x00 |
| 0x0001  | keypad lockout (Child Lock) | 0x00|  
| 0xFFFD       | Cluster Revision|   0x0001 |


###  Electrical Measurment
| Attribute Id | Attribute Name | Attribute Default Value |
| -----------  | -------------- | ----------------------- |
| 0x0508       | Rms Current  |  0|
| 0x0509       | Rms Current Min   |  10 |
| 0x050A       | Rms Current Max   |  0xffff|
| 0x050B       | Active Power    |   0x00   |
| 0x050C       | Active Power Min     |   10  |
| 0x050D       | Active Power Max |   0xffff |
| 0x0602       | Ac Current Multiplier|   1      |
| 0x0603       | Ac Current Divisor|   100     |
| 0x0604       | Ac Power Multiplier |   1      |
| 0x0605       | Ac Power Divisor|   10      |
| 0xFFFD       | Cluster Revision|   3      |


### Simple Metering 
| Attribute Id | Attribute Name | Attribute Default Value |
| -----------  | -------------- | ----------------------- |
| 0x0000       | Current Summation Delivered     |      0x00 |
| 0x0200       | Status                | 0x00|
| 0x0302       | unit of measure       |     0 |
| 0x0505       | multiplier            |     1 |
| 0x0506       | divisor               |     100 |
| 0x0507       | summation formatting  |   |
| 0x0508       | metering device type  |   |
| 0xFFFD       | Cluster Revision      |   3      |






