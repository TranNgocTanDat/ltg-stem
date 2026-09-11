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
    return JSON.parse(
      localStorage.getItem(PROJECTS_KEY) || "[]"
    );
  } catch {
    return [];
  }
};

const saveProjects = (projects: BlocklyProject[]) => {
  localStorage.setItem(
    PROJECTS_KEY,
    JSON.stringify(projects)
  );
};

/**
 * Tạo project mới từ workspace hiện tại
 */
export const createProject = (
  name: string,
  workspace: Blockly.WorkspaceSvg,
): BlocklyProject => {
  const projectName = name.trim();

  if (!projectName) {
    throw new Error("INVALID_PROJECT_NAME");
  }

  const xml = Blockly.utils.xml.domToText(
    Blockly.Xml.workspaceToDom(workspace),
  );

  const project: BlocklyProject = {
    id: uuid(),
    name: projectName,
    updatedAt: Date.now(),
    xml,
  };

  const projects = [project, ...getProjects()];

  saveProjects(projects);

  localStorage.setItem(
    ACTIVE_KEY,
    project.id
  );

  return project;
};

/**
 * Tạo project rỗng
 * Dùng ở Home
 */
export const createEmptyProject = (
  name: string
): BlocklyProject => {
  const projectName = name.trim();

  if (!projectName) {
    throw new Error("INVALID_PROJECT_NAME");
  }

  const xml =
    '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';

  const project: BlocklyProject = {
    id: uuid(),
    name: projectName,
    updatedAt: Date.now(),
    xml,
  };

  const projects = [project, ...getProjects()];

  saveProjects(projects);

  localStorage.setItem(
    ACTIVE_KEY,
    project.id
  );

  return project;
};

/**
 * Cập nhật project hiện tại
 */
export const updateProject = (
  projectId: string,
  workspace: Blockly.WorkspaceSvg,
) => {
  const projects = getProjects();

  const xml = Blockly.utils.xml.domToText(
    Blockly.Xml.workspaceToDom(workspace),
  );

  const exists = projects.some(
    (project) => project.id === projectId
  );

  if (!exists) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  saveProjects(
    projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            xml,
            updatedAt: Date.now(),
          }
        : project
    )
  );
};

/**
 * Load project vào workspace
 */
export const loadProject = (
  projectId: string,
  workspace: Blockly.WorkspaceSvg,
) => {
  const project = getProjects().find(
    (project) => project.id === projectId
  );

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const dom = Blockly.utils.xml.textToDom(
    project.xml
  );

  Blockly.Xml.clearWorkspaceAndLoadFromXml(
    dom,
    workspace
  );

  localStorage.setItem(
    ACTIVE_KEY,
    projectId
  );

  return project;
};

/**
 * Đặt project đang active
 * Dùng ở Home vì Home chưa có Blockly workspace
 */
export const setActiveProject = (
  projectId: string
) => {
  const project = getProjects().find(
    (project) => project.id === projectId
  );

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  localStorage.setItem(
    ACTIVE_KEY,
    projectId
  );

  return project;
};

/**
 * Đổi tên project
 */
export const renameProject = (
  projectId: string,
  name: string
) => {
  const projectName = name.trim();

  if (!projectName) {
    throw new Error("INVALID_PROJECT_NAME");
  }

  const projects = getProjects();

  const exists = projects.some(
    (project) => project.id === projectId
  );

  if (!exists) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  saveProjects(
    projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            name: projectName,
            updatedAt: Date.now(),
          }
        : project
    )
  );
};

/**
 * Nhân bản project
 */
export const duplicateProject = (
  projectId: string
): BlocklyProject => {
  const projects = getProjects();

  const project = projects.find(
    (project) => project.id === projectId
  );

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const copy: BlocklyProject = {
    id: uuid(),
    name: `${project.name} - bản sao`,
    updatedAt: Date.now(),
    xml: project.xml,
  };

  saveProjects([
    copy,
    ...projects,
  ]);

  localStorage.setItem(
    ACTIVE_KEY,
    copy.id
  );

  return copy;
};

/**
 * Xóa project
 */
export const deleteProject = (
  projectId: string
) => {
  const projects = getProjects();

  const exists = projects.some(
    (project) => project.id === projectId
  );

  if (!exists) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const newProjects = projects.filter(
    (project) => project.id !== projectId
  );

  saveProjects(newProjects);

  const activeProjectId =
    getActiveProjectId();

  if (activeProjectId === projectId) {
    if (newProjects.length > 0) {
      localStorage.setItem(
        ACTIVE_KEY,
        newProjects[0].id
      );
    } else {
      localStorage.removeItem(
        ACTIVE_KEY
      );
    }
  }
};

/**
 * Lấy project đang active
 */
export const getActiveProjectId =
  (): string | null => {
    return localStorage.getItem(
      ACTIVE_KEY
    );
  };