<p align="center">
<img src="https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/broccoli.png?sign=7b6211e60087fd8fb1909cca697cb0a3&t=1612709339" alt="broccoli" width="100">
</p>
<h1 align="center">Kelp and Broccoli</h1>

[![](https://img.shields.io/badge/KelpAndBroccoli-green.svg)](https://github.com/cleves0315/kelp-and-broccoli)
[![npm](https://img.shields.io/npm/l/kelp-and-broccoli.svg)](https://github.com/cleves0315/kelp-and-broccoli/blob/master/LICENSE)

> 🍭 哇，一款超可爱的TodoList小程序

## 介绍

海带与西兰花是一款计划管理工具，方便你的日常管理。

使用原生微信小程序云开发.
<p>
<img src="https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/broccoli_3.png?sign=259f4e7b88e911421cbeb63c842d11de&t=1640624761" alt="diagram-1" width="280">
</p>

## 功能

-   添加计划，输入计划名称
-   方便快速设定截止日期与重复周期
-   支持定时推送消息
-   计划类型分类（”我的一天“ 和 ”默认“类型计划）
    -   “我的一天”列表可以看到特殊的背景图，显示在界面中心点 方便当天管理

## 预览

<img src="https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/broccoli-logo.jpg?sign=20165c057e9630056a11128b1b740c08&t=1640626684" alt="diagram-1" width="150">

### 协议字段内容更新
> **云函数**
> - 优化所有云函数 env 环境参数字段 [done]
> - 所有函数，统一返回数据字段：data，即使没有数据也返回 data: null [done]
> 
> **login**
> - 原本返回 OPENID 取消 openID 字段，返回用户id [done]
> - 新增：没有用户信息数据，在数据库生成用户数据 [done]
> ---
>
> **userInfo**
> - 取消原本 "没有用户信息数据，生成一条新的用户数据" 逻辑(移动到login) [done]
> ---
>
> **planinfo**
> - 数据结构：增加 user_id 字段; 原本 open_id 字段 -> 更换成 user_id [done]
> - 函数入参：查询字段 open_id 更换成 user_id [done]
> - 目前只对: get_plan_list、add_plan_list 做了 [open_id -> user_id] 字段更换, 还差剩余几个接口。
> - mytoday_back_image函数：更改字段结构 [done]
> ---
>