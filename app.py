#!/usr/bin/python
# -*- coding: UTF-8 -*-

import httplib, urllib, ssl,socket
import json,base64
import commands
import os
import re
import xmltodict
import time
from flask import Flask, jsonify
from flask import send_from_directory
from flask import request

from fabric.api import run, warn_only
from fabric.tasks import execute

def send_static(route_name, path):
    print 'request_path:'+path
    root_dir = os.path.dirname(os.getcwd())
    pwd_root_dir = os.getcwd()
    print 'pwd:'+os.getcwd()
    print 'root_dir:'+root_dir
    return send_from_directory(os.path.join(pwd_root_dir, 'static', route_name), path)

def cmd_output_dhtmlxgrid(lines, head, col_width, reg_pattern):
    json_data={"rows": {"head": {"column": []}, "row":[]}}
    json_data["rows"]["head"]["column"]=[{'@width': '*', '@sort': 'str', '@align': 'left', '@type': 'ro','@id': x, '#text': x} for x in head]
    idx=1
    for line in lines[1:]:
        content=re.search(reg_pattern,line).groups()
        json_data["rows"]["row"].append({"@id":idx, "cell":[x.strip() for x in content]})
        idx=idx+1
    return xmltodict.unparse(json_data)

def cmd_output_dhtmlxlist(lines, head, col_width, reg_pattern):
    json_data={"data": {"item": []}}
    idx=1
    for line in lines[1:]:
        content=re.search(reg_pattern,line).groups()
        tmp={head[x]: content[x] for x in range(len(head))}
        tmp['@id']=idx
        json_data["data"]["item"].append(tmp)
        idx=idx+1
    return xmltodict.unparse(json_data)


def runcmd(cmd):
    with warn_only():
        ret=run(cmd)
    return (ret.return_code, ret.stdout)

def execcmd(cmd, hosts, cmd_intent, output_format):
    ret=execute(runcmd, cmd, hosts=hosts)
    if(cmd_intent == "display"):
        for host in hosts:
            (status, output)=ret[host]
            if(status == 0):
                ret[host]=(0, cmdgrid2json(output, output_format) )
    return ret      

def cmdgrid2json(cmdgrid, output_format):
    lines=cmdgrid.splitlines()
    head=re.split(' {2,}', lines[0])
    index=[lines[0].index(x) for x in head]
    col_width=[index[x+1]-index[x] for x in range(len(index)-1)]
    reg_pattern=''.join(['(.{'+'{0}'.format(x)+'})' for x in col_width ]) + '(.{1,})'

    if(output_format=='dhtmlxgrid'):
        ret=cmd_output_dhtmlxgrid(lines, head, col_width, reg_pattern)
    elif(output_format=='dhtmlxlist'):
        ret=cmd_output_dhtmlxlist(lines, head, col_width, reg_pattern)
    else:
        json_data=[]
        for line in lines[1:]:
            content=re.search(reg_pattern,line).groups()
            json_data.append({head[x]: content[x] for x in range(len(head))})
            json_data=json.dumps(json_data)
            ret=(json_data, head, status)
    return ret

command_list={'dockerps': 'docker ps', 
              'dockerimages': 'docker images',
              'dfh': 'df -h',
              'restartdocker': 'service docker restart',
              'restartmachine': 'reboot',
              'restartovs': 'service openvswitch restart',
              'restartocnode': 'service origin-node restart',
              'dockerstats': 'docker stats --no-stream=true $(docker ps -qa)',
              'ocgetnode': 'oc get node'}

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file("index.html")

@app.route('/codebase/<path:path>')
def code_static(path):
    return send_static('codebase', path)

@app.route('/imgs/<path:path>')
def imgs_static(path):
    return send_static('imgs', path)

@app.route('/server/<path:path>')
def server_static(path):
    return send_static('server', path)

@app.route('/command/grid/<string:cmd>/<string:host>')
def cmd_gridproc(cmd, host):
    cmd_ret=execcmd(cmd=command_list[cmd], hosts=[host], cmd_intent="display", output_format="dhtmlxgrid")
    (statsu,output)=cmd_ret[host]
    return output

@app.route('/command/list/<string:cmd>/<string:host>')
def cmd_listproc(cmd, host):
    cmd_ret=execcmd(cmd=command_list[cmd], hosts=[host], cmd_intent="display", output_format="dhtmlxlist")
    (statsu,output)=cmd_ret[host]
    return output

@app.route('/command/exec/<string:cmd>/<string:host>')
def cmd_execproc(cmd, host):
    cmd_ret=execcmd(cmd=command_list[cmd], hosts=[host], cmd_intent="exec", output_format="")
    (statsu,output)=cmd_ret[host]
    return output

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8088, debug=True)
