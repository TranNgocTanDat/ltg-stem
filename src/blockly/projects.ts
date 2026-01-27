import * as Blockly from "blockly";

export type BlocklyProject = {
  id: string;
  name: string;
  updatedAt: number;
  xml: string;
};

const PROJECTS_KEY = "blockly_projects";
const ACTIVE_KEY = "blockly_active_project";

const uuid = () => crypto.randomUUID();

export const getProjects = (): BlocklyProject[] => {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveProjects = (projects: BlocklyProject[]) => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const createProject = (
  name: string,
  workspace: Blockly.WorkspaceSvg
): BlocklyProject => {
  const xml = Blockly.utils.xml.domToText(
    Blockly.Xml.workspaceToDom(workspace)
  );

  const project: BlocklyProject = {
    id: uuid(),
    name,
    updatedAt: Date.now(),
    xml,
  };

  const projects = [project, ...getProjects()];
  saveProjects(projects);
  localStorage.setItem(ACTIVE_KEY, project.id);

  return project;
};

export const updateProject = (
  projectId: string,
  workspace: Blockly.WorkspaceSvg
) => {
  const projects = getProjects();

  const xml = Blockly.utils.xml.domToText(
    Blockly.Xml.workspaceToDom(workspace)
  );

  saveProjects(
    projects.map(p =>
      p.id === projectId
        ? { ...p, xml, updatedAt: Date.now() }
        : p
    )
  );
};

export const loadProject = (
  projectId: string,
  workspace: Blockly.WorkspaceSvg
) => {
  const project = getProjects().find(p => p.id === projectId);
  if (!project) return;

  const dom = Blockly.utils.xml.textToDom(project.xml);
  Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);

  localStorage.setItem(ACTIVE_KEY, projectId);
};

export const getActiveProjectId = (): string | null =>
  localStorage.getItem(ACTIVE_KEY);
