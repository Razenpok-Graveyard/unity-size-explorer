<script setup lang="ts">
import {computed, ref} from "vue"
import Tree from "vue3-treeview";
import "vue3-treeview/dist/style.css"
import {logEntries, mergeSize, setPieChartData} from "../store";
import {BuildEntry} from "../store/BuildEntry";
import {INode} from "vue3-treeview/dist/structure/INode";

class TreeNode {
  id: string;
  name: string;
  size: number = 0;
  children: TreeNode[] = [];
  state = { checked: true, opened: false, indeterminate: false };

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  pushNode(parts: string[], entry: BuildEntry) {
    if (parts.length === 0) {
      this.size = entry.size;
      return;
    }

    const childName = parts[0];
    const childId = `${this.id}/${childName}`;
    let child = this.children.find(c => c.id === childId);
    if (child === undefined) {
      child = new TreeNode(childId, childName);
      this.children.push(child);
    }

    child.pushNode(parts.slice(1), entry);
    this.size += entry.size;
  }

  merge(size: number) {
    const children = [];
    for (const child of this.children) {
      child.merge(size);
      if (child.size > size) {
        children.push(child);
      }
    }

    this.children = children;
  }

  sort() {
    this.children.sort((a, b) => b.size - a.size);
    for (const child of this.children) {
      child.sort();
    }
  }

  prune() {
    for (const c of this.children) {
      c.prune();
    }

    if (this.children.length !== 1) {
      return;
    }

    const child = this.children[0];
    if (child.children.length > 0) {
      return;
    }

    this.id = child.id;
    this.name = `${this.name}/${child.name}`;
    this.children = [];
  }

  flatten(nodes: any) {
    for (const child of this.children) {
      let size = child.size;
      let units = "mb";
      if (child.size < 1) {
        size *= 1000;
        units = "kb";
      }
      nodes[child.id] = {
        text: `${child.name} — ${size.toFixed(1)} ${units}`,
        children: child.rootNodes,
        state: child.state
      };
      child.flatten(nodes);
    }
    return nodes;
  }

  get rootNodes() {
    return this.children.map(c => c.id);
  }

  populateNodesForPieChart(nodes: TreeNode[]) {
    if (!this.state.checked && !this.state.indeterminate) {
      return;
    }

    if (this.state.opened) {
      for (const child of this.children) {
        child.populateNodesForPieChart(nodes);
      }

      return;
    }

    nodes.push(this);
  }

  findById(id: string | undefined): TreeNode | undefined {
    if (this.id === id) {
      return this;
    }

    for (const child of this.children) {
      const found = child.findById(id);
      if (found !== undefined) {
        return found;
      }
    }

    return undefined;
  }

  propagateChecked(checked: boolean) {
    this.state.checked = checked;
    for (const child of this.children) {
      child.propagateChecked(checked);
    }
  }
}

const tree = computed(() => {
  const entries = logEntries.value;
  const root = new TreeNode("", "");
  for (const entry of entries) {
    const parts = entry.path.split("/");
    root.pushNode(parts, entry);
  }

  root.merge(mergeSize.value);
  root.prune();
  root.sort();
  return root;
})

const nodes = computed(() => ref(tree.value.flatten({})));

const config = computed(() => {
  updatePieChart();
  return ({
    roots: tree.value.rootNodes,
    checkboxes: true,
    checkMode: 0
  });
});

function onNodeChecked(node: INode) {
  const treeNode = tree.value.findById(node.id);
  treeNode?.propagateChecked(true);
  updatePieChart();
}

function onNodeUnchecked(node: INode) {
  const treeNode = tree.value.findById(node.id);
  treeNode?.propagateChecked(false);
  updatePieChart();
}

function updatePieChart() {
  const nodes: TreeNode[] = [];
  for (const child of tree.value.children) {
    child.populateNodesForPieChart(nodes);
  }
  setPieChartData(nodes.map(n => n.name), nodes.map(n => n.size));
}

const minMergeSize = computed(() => Math.min(...logEntries.value.map(e => e.size)));
const maxMergeSize = computed(() => Math.max(...logEntries.value.map(e => e.size)));
</script>

<template>
  <div>Merge entries with size less than {{(mergeSize * 1000).toFixed(1)}} kb</div>
  <input class="merge-slider" type="range" :min="minMergeSize" :max="maxMergeSize" v-model="mergeSize" step="0.01">
  <Tree
      :config="config"
      :nodes="nodes"
      @node-checked="onNodeChecked"
      @node-unchecked="onNodeUnchecked"
      @node-toggle="updatePieChart"
  />
</template>

<style scoped>
.merge-slider {
  width: 80%;
}
</style>
