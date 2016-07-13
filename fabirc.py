import re
import json
import xmltodict
from fabric.api import run, warn_only
from fabric.tasks import execute

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

def execcmd(cmd, hosts, output_formate):
    ret=execute(runcmd, cmd, hosts=hosts)
    for host in hosts:
        (status, output)=ret[host]
        if(status == 0):
            ret[host]=(0, cmdgrid2json(output, output_formate) )
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

if __name__ == "__main__":
    hosts=['root@cluster-node1', 'root@cluster-node2']
    ret=execcmd("df -h", hosts, 'dhtmlxgrid')
    print ret
