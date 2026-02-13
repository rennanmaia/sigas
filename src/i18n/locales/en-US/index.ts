import type { I18nResource } from "@/i18n/types";

export const enUS: I18nResource = {
    common: {
        sidebar: {
            user: {
                title: "User"
            },
            groups: {
                items: {
                    dashboard: "Dashboard",
                    projects: "Projects",
                    forms: "Forms",
                    liabilities: "Liabilities",
                    chats: "Messages",
                    profiles: "Profiles",
                    users: "Users"
                },
                title: "General"
            },
            others: {   
                title: "Others",
                items: {
                    settings: {
                        title: "Settings",
                        items: {
                            account: "Account",
                            notifications: "Notifications",
                            profile: "Profile"
                        }
                    },
                    help: {
                        title: "Help"   
                    }
                }
            }
        },
        themes: {
            light: "Light",
            dark: "Dark",
            system: "System"
        },
        command: {
            menu: {
                input: "Type a command or search...",
                empty: "No command found.",
                theme: "Theme"
            }
        },
        comming: {
            title: "Coming Soon!",
            description: "This page hasn't been created yet. Stay tuned!"
        },
        buttons: {
            download: "Download",
            globalSearch: "Search",
            continue: "Continue",
            cancel: "Cancel",
        },
        pagination: {
            pageOf: "Page {{current}} of {{total}}",
            rowsPer: "Rows per page"
        },
        table: {
            viewOptions: {
                title: "View",
                menuTitle: "Show Columns"
            }
        },
        navigation: {
            profile: "Profile",
            billing: "Billing",
            settings: "Settings",
            newTeam: "New Team",
            signOut: "Sign Out",
            toggleTheme: "Toggle theme"
        },
        dialogs: {
            signOut: {
                title: "Sign Out",
                description: "Are you sure you want to sign out? You will need to log in again to access your account.",
                confirmText: "Sign Out"
            }
        },
        dropdown: {
            upgradeToPro: "Upgrade to Pro",
            account: "Account",
            billing: "Billing",
            notifications: "Notifications",
            signOut: "Sign Out"
        },
        team: {
            label: "Teams",
            addTeam: "Add team"
        }
    },
    dashboard: {
        title: "Dashboard",
        tabs: {
            overview: "Overview",
            analytics: "Analytics",
            notifications: "Notifications",
            reports: "Reports",
            nav: {
                costumers: "Customers",
                overview: "Overview",
                products: "Products",
                settings: "Settings"
            }
        }
    },
    forms: {
        create: {
            form_builder: {
                form: {
                    title: "Untitled Form",
                    description: "Form without description",
                    control: {
                        title: "Form Title",
                        description: "Description or instructions...",
                        project: {
                            title: "Linked Project *",
                            empty: "None (create as draft)",
                            placeholder: "Select a project",
                            preselected: "Pre-selected project and cannot be changed",
                            questions: {
                                alert: "Add at least one question to the form before saving it.",
                                empty: {
                                    title: "Your form is empty.",
                                    description: "Select a question type to get started."
                                }
                            }
                        }
                    }
                },
                dialog: {
                    confirm: {
                        title: "Save without linked project?",
                        description:
                        "<0>This form will be created <1>WITHOUT a linked project</1>.</0>" +
                        "<2>This means that:</2>" +
                        "<3>" +
                            "<0>It will be saved as <1>DRAFT</1></0>" +
                            "<1><1>CANNOT</1> be answered</1>" +
                            "<2>To activate it, you will need to link it to a project</2>" +
                        "</3>" +
                        "<4>Do you want to continue anyway?</4>",
                        confirm: "Yes, save as draft",
                        cancel: "Cancel",
                    },
                },
                validation: {
                    title: {
                        minLength: "The title must be at least 3 characters",
                        maxLength: "The title must not exceed 100 characters"
                    },
                    description: {
                        minLength: "The description must be at least 5 characters"
                    },
                    questions: {
                        minArray: "The form must have at least one question"
                    },
                    options: {
                        minArray: "Must have at least 2 options"
                    }
                }
            }
        },
        list: {
            title: "Forms",
            description: "Manage and publish your forms"
        }
    },
    profiles: {
        list: {
            buttons: {
                add: "Add New Profile",
            },
            title: "Profile List",
            description: "Manage your profiles and their roles here.",
            table: {
                columns: {
                    actions: {
                        delete: "Delete",
                        edit: "Edit",
                        view: "View"
                    },
                },
                filters: {},
                headers: {
                    role: "Profile",
                    description: "Description",
                    permissions: "Permissions"
                },
                noResults: "No profiles found in results!",
                searchPlaceholder: "Search by profile name"
            }
        },
        create: {
            title: "Create New Profile",
            form: {
                name: {
                    label: "Profile Name",
                    validation: {
                        required: "Profile name is required"
                    }
                },
                description: {
                    label: "Description",
                    placeholder: "Profile description"
                },
                permissions: {
                    label: "Permissions",
                    validation: {
                        required: "Select at least one permission"
                    }
                }
            },
            actions: {
                save: "Save",
                cancel: "Cancel"
            }
        }
    },
    users: {
        list: {
            title: "User List",
            description: "Manage your users and their roles here.",
            buttons: {
                add: "Add New User"
            },
            table: {
                searchPlaceholder: "Search by name",
                noResults: "No users found in results!",
                filters: {
                    name: "Name",
                    roles: "Profile",
                    status: "Status"
                },
                headers: {
                    fullName: "Name",
                    username: "User",
                    cpf: "CPF",
                    email: "Email",
                    roles: "Profiles",
                    status: "Status",
                },
                columns: {
                    actions: {
                        delete: "Delete",
                        view: "View"
                    }
                },
            }
        },
        create: {
            title: "Create New User",
            description: "Create a new user to join your team by sending an email invitation and assign a role to set their access level.",
            submit: {
                message: "Invitation sent. An email with next steps has been sent."
            },
            form: {
                cpf: {
                    label: "CPF",
                    placeholder: "xxx.xxx.xxx-xx",
                    validation: {
                        invalid: "Invalid CPF format",
                        required: "Add a CPF!"
                    }
                },
                fullname: {
                    label: "Full Name",
                    placeholder: "ex: John Carvalho",
                    validation: {
                        required: "Name is required!"
                    }
                },
                email: {
                    label: "Email",
                    placeholder: "ex: johncarvalho@gmail.com",
                    validation: {
                        invalid: "Invalid email!"
                    }
                },
                roles: {
                    label: "Profiles",
                    placeholder: "Search profiles",
                    selectionPlaceholder: "Select Profiles",
                    notFound: "Profile not found!",
                    validation: {
                        required: "Choose at least 1 profile"
                    }
                },
                description: {
                    label: "Description (Optional)",
                    placeholder: "Add a personal message to send to this user in your invitation (optional)"
                },
            },
            actions: {
                cancel: "Cancel",
                create: "Create"
            }
        }
    },
    projects: {
        list: {
            title: "Projects",
            description: "Manage your projects",
            buttons: {
                new: "Create project",
                logs: "History"
            },
            filters: {
                all: "All projects",
                active: "Active",
                paused: "Paused",
                finished: "Finished",
                canceled: "Canceled",
                expired: "Expired"
            },
            noResults: "No projects found!",
            searchPlaceholder: "Search projects"
        },
        create: {
            title: "Create New Project",
            form: {
                title: {
                    label: "Title",
                    validation: {
                        required: "Title is required"
                    }
                },
                description: {
                    label: "Description",
                    validation: {
                        required: "Description is required"
                    }
                },
                category: {
                    label: "Category"
                },
                startDate: {
                    label: "Start Date",
                    validation: {
                        required: "Start date is required"
                    }
                },
                endDate: {
                    label: "End Date",
                    validation: {
                        required: "End date is required"
                    }
                },
                responsible: {
                    label: "Responsible",
                    validation: {
                        required: "Responsible is required"
                    }
                },
                budget: {
                    label: "Budget",
                    validation: {
                        positive: "Budget must be positive"
                    }
                },
                company: {
                    label: "Company",
                    validation: {
                        required: "Responsible company is required"
                    }
                },
                customFields: {
                    label: {
                        validation: {
                            required: "Title is required"
                        }
                    },
                    value: {
                        validation: {
                            required: "Value is required"
                        }
                    }
                }
            }
        },
        edit: {
            title: "Edit Project"
        },
        view: {
            title: "View Project"
        }
    },
    passives: {
        list: {
            title: "Liabilities",
            description: "Manage your liabilities here.",
            tabs: {
                overview: "Overview",
                management: "Management",
                risks: "Critical Risks"
            },
            buttons: {
                new: "New Liability"
            },
            table: {
                searchPlaceholder: "Search by liability",
                noResults: "No liabilities found!"
            }
        }
    },
    chats: {
        title: "Messages",
        tabs: {
            messages: "Conversations",
            support: "Support"
        },
        buttons: {
            new: "New Conversation",
            send: "Send",
            call: "Call",
            video: "Video"
        },
        search: {
            placeholder: "Search conversation"
        },
        messages: {
            noChat: "Select a conversation to start",
            typePlaceholder: "Type a message..."
        }
    },
    settings: {
        title: "Settings",
        navigation: {
            profile: "Profile",
            account: "Account",
            notifications: "Notifications"
        },
        profile: {
            title: "Profile",
            description: "This is how other users will see your profile",
            form: {
                name: {
                    label: "Name",
                    placeholder: "Your full name",
                    validation: {
                        required: "Name is required"
                    }
                },
                email: {
                    label: "Email",
                    placeholder: "your.email@example.com",
                    validation: {
                        invalid: "Invalid email"
                    }
                },
                bio: {
                    label: "Bio",
                    placeholder: "Tell us a bit about yourself",
                    validation: {
                        minLength: "Bio must be at least 4 characters",
                        maxLength: "Bio must not exceed 160 characters"
                    }
                },
                urls: {
                    label: "URLs",
                    validation: {
                        invalid: "Invalid URL"
                    }
                }
            }
        },
        account: {
            title: "Account",
            description: "Update your account settings. Set your preferred language and timezone.",
            form: {
                name: {
                    label: "Name",
                    validation: {
                        required: "Name is required",
                        minLength: "Name must be at least 2 characters",
                        maxLength: "Name must not exceed 30 characters"
                    }
                },
                dob: {
                    label: "Date of Birth"
                },
                language: {
                    label: "Language"
                },
                theme: {
                    label: "Theme"
                }
            }
        },
        display: {
            title: "Display",
            form: {
                items: {
                    label: "Items",
                    validation: {
                        required: "You must select at least one item"
                    }
                }
            }
        },
        notifications: {
            title: "Notifications",
            description: "Configure how you receive notifications.",
            form: {
                email: {
                    label: "Email Notifications"
                },
                push: {
                    label: "Push Notifications"
                },
                sms: {
                    label: "SMS Notifications"
                }
            }
        }
    }
}
